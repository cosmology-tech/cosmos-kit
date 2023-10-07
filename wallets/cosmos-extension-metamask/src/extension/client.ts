import { OfflineAminoSigner, StdSignature, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { ChainRecord, SignType } from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import {
  Chain,
  CosmJSOfflineSigner,
  CosmosSnap,
  installSnap,
  suggestChain,
} from '@cosmsnap/snapper';
import { SignDoc } from '@keplr-wallet/types';

export class CosmosExtensionClient implements WalletClient {
  cosmos: CosmosSnap;
  private _defaultSignOptions: SignOptions = {
    preferNoSetFee: true,
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
    // return this.client.getOfflineSignerAuto(chainId);
  }

  getOfflineSignerAmino(chainId: string) {
    return new CosmJSOfflineSigner(chainId) as unknown as OfflineAminoSigner;
  }

  getOfflineSignerDirect(chainId: string) {
    return new CosmJSOfflineSigner(chainId);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
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
    signDoc: SignDoc,
    signOptions?: SignOptions
  ) {
    return await this.cosmos.signDirect(chainId, signer, signDoc);
  }
}
