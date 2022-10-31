import { WalletClient, WalletMode } from '@cosmos-kit/core';

import { Leap } from './extension/types';

export class LeapClient implements WalletClient {
  readonly client: Leap;
  readonly mode: WalletMode;

  constructor(client: Leap, mode: WalletMode) {
    this.client = client;
    this.mode = mode;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async getAccount(chainId: string) {
    const key = await this.client.getKey(chainId);
    return {
      name: key.name,
      address: key.bech32Address,
    };
  }

  getOfflineSigner(chainId: string) {
    return this.client.getOfflineSigner(chainId);
  }
}
