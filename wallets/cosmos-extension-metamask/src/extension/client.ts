import { OfflineAminoSigner, StdSignature, StdSignDoc, AminoSignResponse } from '@cosmjs/amino';
import { Algo, DirectSignResponse } from '@cosmjs/proto-signing';
import { ChainRecord, DirectSignDoc, SignType } from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import {
  Chain,
  CosmJSOfflineSigner,
  CosmosSnap,
  installSnap,
  signDirect,
  suggestChain,
} from '@cosmsnap/snapper';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';

export class CosmosExtensionClient implements WalletClient {
  cosmos: CosmosSnap;
  private _defaultSignOptions: SignOptions = {
    preferNoSetFee: false,
    preferNoSetMemo: true,
    disableBalanceCheck: true,
  };

  get defaultSignOptions() {
    return this._defaultSignOptions;
  }

  setDefaultSignOptions(options: SignOptions) {
    this._defaultSignOptions = options;
  }

  constructor() {
    this.cosmos = new CosmosSnap();
  }

  async addChain(chainInfo: ChainRecord) {
    await suggestChain(chainInfo.chain as unknown as Chain);
  }

  async getSimpleAccount(chainId: string) {
    const { address } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
    };
  }

  async getAccount(chainId: string) {
    await installSnap();
    const key = await this.cosmos.getAccount(chainId);
    return {
      address: key.address,
      algo: key.algo as Algo,
      pubkey: key.pubkey,
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
  }

  getOfflineSignerAmino(chainId: string) {
    return new CosmJSOfflineSigner(chainId) as unknown as OfflineAminoSigner;
  }

  getOfflineSignerDirect(chainId: string) {
    return {
      getAccounts: async () => {
        return [await this.getAccount(chainId)];
      },
      signDirect: async (signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> => {
        const { accountNumber } = signDoc;

        const signDocNew = {
          bodyBytes: signDoc.bodyBytes,
          authInfoBytes: signDoc.authInfoBytes,
          chainId: signDoc.chainId,
          accountNumber: Long.fromString(signDoc.accountNumber.toString())
        };
        const signRes = await signDirect(chainId, signerAddress, signDocNew);
        const sign = {
          signature: signRes.signature,
          signed: {
            ...signRes.signed,
            accountNumber,
            authInfoBytes: new Uint8Array(
              Object.values(signRes.signed.authInfoBytes),
            ),
            bodyBytes: new Uint8Array(Object.values(signRes.signed.bodyBytes)),
          },
        };
        return sign
      }
    };
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<AminoSignResponse> {
    return await this.cosmos.signAmino(chainId, signer, signDoc);
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    const signature = await this.cosmos.signArbitrary(chainId, signer, data);
    return signature;
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<DirectSignResponse> {

    const { accountNumber } = signDoc;

    const signDocNew = {
      bodyBytes: signDoc.bodyBytes,
      authInfoBytes: signDoc.authInfoBytes,
      chainId: signDoc.chainId,
      accountNumber: Long.fromString(accountNumber.toString())
    };
    const signRes = await signDirect(chainId, signer, signDocNew);
    const sign = {
      signature: signRes.signature,
      signed: {
        ...signRes.signed,
        accountNumber,
        authInfoBytes: new Uint8Array(
          Object.values(signRes.signed.authInfoBytes),
        ),
        bodyBytes: new Uint8Array(Object.values(signRes.signed.bodyBytes)),
      },
    };

    return sign;
  }
}