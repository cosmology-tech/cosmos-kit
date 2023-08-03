import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCoin98Extension } from './chain-wallet';
import { Coin98Client } from './client';
import { getCoin98FromExtension } from './utils';

export class Coin98ExtensionWallet extends MainWalletBase {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainCoin98Extension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async initClient() {
    this.initingClient();
    try {
      const coin98 = await getCoin98FromExtension();
      this.initClientDone(coin98 ? new Coin98Client(coin98) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
