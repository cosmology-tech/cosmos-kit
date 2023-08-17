import { OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo, DirectSignResponse } from '@cosmjs/proto-signing';
import { SignType } from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import { SignDoc } from '@keplr-wallet/types';

import { cosmjsOfflineSigner } from './cosmjs-offline-signer';
import {
  connectSnap,
  getKey,
  getSnap,
  requestSignAmino,
  requestSignDirect,
} from './snap-connector';

export class CosmosSnapClient implements WalletClient {
  readonly snapInstalled: boolean = false;

  constructor() {
    this.snapInstalled = localStorage.getItem('snapInstalled') === 'true';
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

  async handleConnect() {
    const installedSnap = await getSnap();
    if (!installedSnap) {
      await connectSnap();
    }
  }

  async getAccount(chainId: string) {
    await this.handleConnect();
    const key = await getKey(chainId);
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
  }

  getOfflineSignerAmino(chainId: string) {
    return (new cosmjsOfflineSigner(chainId) as unknown) as OfflineAminoSigner;
  }

  getOfflineSignerDirect(chainId: string) {
    return new cosmjsOfflineSigner(chainId);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return requestSignAmino(chainId, signer, signDoc);
  }

  async signDirect(chainId: string, signer: string, signDoc: SignDoc) {
    return (requestSignDirect(
      chainId,
      signer,
      signDoc
    ) as unknown) as DirectSignResponse;
  }
}
