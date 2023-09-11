import { OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import {
  ChainRecord,
  SignType,
} from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import { isSnapInitialized, isSnapInstalled, CosmosSnap, suggestChain, Chain, CosmJSOfflineSigner } from '@cosmsnap/snapper';
import { SignDoc } from '@keplr-wallet/types';

export class CosmosExensionClient implements WalletClient {
  cosmos: CosmosSnap = new CosmosSnap();
  snapInitialized: boolean = false;
  snapInstalled: boolean = false;

  constructor() {
    isSnapInitialized().then(res => this.snapInitialized = res);
    isSnapInstalled().then(res => this.snapInstalled = res);
  }

  async addChain(chainInfo: ChainRecord) {
    await suggestChain(chainInfo.chain as unknown as Chain)
  }

  async getSimpleAccount(chainId: string) {
    const { address } = await this.cosmos.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
    };
  }

  async getAccount(chainId: string) {
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
    return (new CosmJSOfflineSigner(chainId) as unknown) as OfflineAminoSigner;
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

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: SignDoc,
    signOptions?: SignOptions
  ) {
    return await this.cosmos.signDirect(chainId, signer, signDoc);
  }
}
