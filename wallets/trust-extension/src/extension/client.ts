import { Algo } from '@cosmjs/proto-signing';
import { SignType, WalletClient } from '@cosmos-kit/core';

import { Trust } from './types';

export class TrustClient implements WalletClient {
  readonly client: Trust;

  constructor(client: Trust) {
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

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    // switch (preferredSignType) {
    //   case 'amino':
    //     return this.getOfflineSignerAmino(chainId);
    //   case 'direct':
    //     return this.getOfflineSignerDirect(chainId);
    //   default:
    //     return this.getOfflineSignerAmino(chainId);
    // }
    return this.client.getOfflineSigner(chainId);
  }
}
