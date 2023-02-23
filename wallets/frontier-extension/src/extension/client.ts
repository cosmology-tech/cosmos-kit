import { StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import { DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';

import { Frontier } from './types';

export class FrontierClient implements WalletClient {
  readonly client: Frontier;

  constructor(client: Frontier) {
    this.client = client;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async getAccount(chainId: string) {
    const key = await this.client.getKey(chainId);
    // console.log('%cclient.ts line:25 key', 'color: #007acc;', key);
    return {
      name: key.name,
      address: key.bech32Address,
      algo: key.algo as Algo,
      pubkey: key.pubKey,
    };
  }

  getOfflineSigner(chainId: string) {
    return this.client.getOfflineSignerAuto(chainId);
  }

  getOfflineSignerAmino(chainId: string) {
    return this.client.getOfflineSignerOnlyAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return this.client.getOfflineSigner(chainId) as OfflineDirectSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signAmino(chainId, signer, signDoc, signOptions);
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
}
