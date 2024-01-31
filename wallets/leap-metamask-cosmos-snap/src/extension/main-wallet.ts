import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainMetamaskCosmosSnap } from './chain-wallet';
import { CosmosSnapClient } from './client';
import { isMetamaskInstalled } from './utils';

export class MetamaskCosmosSnapWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainMetamaskCosmosSnap);
  }

  async initClient() {
    this.initingClient();
    try {
      const installed = await isMetamaskInstalled();
      this.initClientDone(installed ? new CosmosSnapClient() : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
