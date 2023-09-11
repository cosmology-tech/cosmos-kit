import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCosmosExtensionMetamaskSnap } from './chain-wallet';
import { CosmosExensionClient } from './client';

export class CosmosMetamaskExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmosExtensionMetamaskSnap);
  }

  async initClient() {
    this.initingClient();
    try {
      this.initClientDone(new CosmosExensionClient());
    } catch (error) {
      this.initClientError(error);
    }
  }
}
