import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { StdSignature, StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  ChainRecord,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  SignOptions,
  SignType,
  SuggestToken,
  WalletClient,
} from '@cosmos-kit/core';
import { BroadcastMode, Keplr } from '@keplr-wallet/types';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import {
  AuthInfo,
  SignDoc,
  SignerInfo,
  Tx,
  TxBody,
} from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { addressBytesFromBech32 } from './utils';

export class KeplrClient implements WalletClient {
  readonly client: Keplr;

  constructor(client: Keplr) {
    this.client = client;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async suggestToken({ chainId, tokens, type }: SuggestToken) {
    if (type === 'cw20') {
      for (const { contractAddress, viewingKey } of tokens) {
        await this.client.suggestToken(chainId, contractAddress, viewingKey);
      }
    }
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async getAccount(chainId: string) {
    const key = await this.client.getKey(chainId);
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo as Algo,
      pubkey: key.pubKey,
    };
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
    // return this.client.getOfflineSignerAuto(chainId);
  }

  getOfflineSignerAmino(chainId: string) {
    return this.client.getOfflineSignerOnlyAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return this.client.getOfflineSigner(chainId) as OfflineDirectSigner;
  }

  async addChain(chainInfo: ChainRecord) {
    const suggestChain = chainRegistryChainToKeplr(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );

    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      (suggestChain.rest as
        | string
        | ExtendedHttpEndpoint) = chainInfo.preferredEndpoints?.rest?.[0];
    }

    if (chainInfo.preferredEndpoints?.rpc?.[0]) {
      (suggestChain.rpc as
        | string
        | ExtendedHttpEndpoint) = chainInfo.preferredEndpoints?.rpc?.[0];
    }

    await this.client.experimentalSuggestChain(suggestChain);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signAmino(chainId, signer, signDoc, signOptions);
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    return await this.client.signArbitrary(chainId, signer, data);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signDirect(chainId, signer, signDoc, signOptions);
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.client.sendTx(chainId, tx, mode);
  }

  async signAATx(
    chainID: string,
    accountAddress: string,
    accountNumber: number,
    sequence: number,
    unsignedTx: Uint8Array
  ) {
    const accountAddrBytes = addressBytesFromBech32(accountAddress);

    const body = TxBody.decode(unsignedTx);

    const authInfo = AuthInfo.fromPartial({
      signerInfos: [
        SignerInfo.fromPartial({
          publicKey: {
            typeUrl: '/abstractaccount.v1.NilPubKey',
            value: new Uint8Array([10, 32, ...accountAddrBytes]), // a little hack to encode the pk into proto bytes
          },
          modeInfo: {
            single: {
              mode: SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: sequence,
        }),
      ],
      fee: {
        amount: [],
        gasLimit: 200000,
      },
    });

    // prepare sign bytes
    const signDoc = SignDoc.fromPartial({
      bodyBytes: TxBody.encode(body).finish(),
      authInfoBytes: AuthInfo.encode(authInfo).finish(),
      chainId: chainID,
      accountNumber: accountNumber,
    });
    const signBytes = SignDoc.encode(signDoc).finish();

    // const signBytesHex = "0x" + encodeHex(signBytes);
    const sender = await this.client.getKey(chainID);
    const signArbSig = await this.client.signArbitrary(
      chainID,
      sender.bech32Address,
      signBytes
    );
    const signArbSigBytes = new TextEncoder().encode(
      JSON.stringify(signArbSig)
    );

    return Tx.fromPartial({
      body,
      authInfo,
      signatures: [signArbSigBytes],
    });
  }
}
