import { Algo } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';

import { Okxwallet } from './types';

export class OkxwalletClient implements WalletClient {
  readonly client: Okxwallet;

  constructor(client: Okxwallet) {
    this.client = client;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
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

  getOfflineSigner(chainId: string) {
    return this.client.getOfflineSigner(chainId);
  }
}
