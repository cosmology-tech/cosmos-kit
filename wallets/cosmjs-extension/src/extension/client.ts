import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { StdSignature, StdSignDoc } from '@cosmjs/amino';
import { Bip39, Random } from '@cosmjs/crypto';
import { Algo, OfflineDirectSigner, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

import {
  BroadcastMode,
  ChainRecord,
  ExtendedHttpEndpoint,
  SignType,
  SuggestToken,
} from '@cosmos-kit/core';
import { DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';

import { Cosmjs } from './types';
import Long from 'long';

export class CosmjsClient implements WalletClient {
  readonly client: Cosmjs;
  readonly mnemonic: string;
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

  constructor(client: Cosmjs, mnemonic?: string) {
    this.client = client;
    this.mnemonic = mnemonic || this.generateMnemonic();
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async suggestToken({ chainId, tokens, type }: SuggestToken) {
    if (type === 'cw20') {
      for (const { contractAddress } of tokens) {
        await this.client.suggestCW20Token(chainId, contractAddress);
      }
    }
  }

  async addChain(chainInfo: ChainRecord) {
    const suggestChain = chainRegistryChainToKeplr(
      chainInfo.chain,
      (chainInfo.assetList ? [chainInfo.assetList] : []) as any,
    );

    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      (suggestChain.rest as string | ExtendedHttpEndpoint) =
        chainInfo.preferredEndpoints?.rest?.[0];
    }

    if (chainInfo.preferredEndpoints?.rpc?.[0]) {
      (suggestChain.rpc as string | ExtendedHttpEndpoint) = chainInfo.preferredEndpoints?.rpc?.[0];
    }

    await this.client.experimentalSuggestChain(suggestChain);
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async getSimpleAccount(chainId: string) {
    const { wallet, address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      wallet,
      address,
      username,
    };
  }

  generateMnemonic(): string {
    return Bip39.encode(Random.getBytes(16)).toString();
  }

  async getAccount(chainId: string) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic);
    const [firstAccount] = await wallet.getAccounts();
    return {
      username: firstAccount.address,
      wallet: wallet,
      address: firstAccount.address,
      algo: firstAccount.algo as Algo,
      pubkey: firstAccount.pubkey,
      isNanoLedger: false,
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

  async signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions) {
    return await this.client.signAmino(
      chainId,
      signer,
      signDoc,
      signOptions || this.defaultSignOptions,
    );
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array,
  ): Promise<StdSignature> {
    return await this.client.signArbitrary(chainId, signer, data);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions,
  ) {
    return await this.client.signDirect(
      chainId,
      signer,
      {
        ...signDoc,
        accountNumber: Long.fromString(signDoc.accountNumber.toString()),
      },
      signOptions || this.defaultSignOptions,
    );
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
}
