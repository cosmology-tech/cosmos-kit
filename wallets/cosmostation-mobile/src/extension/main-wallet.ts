import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { CosmostationMobile } from './chain-wallet';
import { CosmostationClient } from './client';
import { getCosmostationFromExtension } from './utils';

export class CosmostationMobileWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, CosmostationMobile);
  }

  async initClient() {
    this.initingClient();
    try {
      const cosmostation = await getCosmostationFromExtension();
      this.initClientDone(
        cosmostation ? new CosmostationClient(cosmostation) : undefined
      );
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
