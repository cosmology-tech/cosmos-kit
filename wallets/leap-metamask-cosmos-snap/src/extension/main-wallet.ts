import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainMetamaskCosmosSnap } from './chain-wallet';
import { CosmosSnapClient } from './client';

export class MetamaskCosmosSnapWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainMetamaskCosmosSnap);
  }

  async initClient() {
    this.initingClient();
    try {
      this.initClientDone(new CosmosSnapClient());
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
