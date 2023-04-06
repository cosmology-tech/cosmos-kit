import { Wallet } from '@cosmos-kit/core';
import { MainWallet } from '@cosmos-kit/core';

import { ChainCosmostationExtension } from './chain-wallet';
import { CosmostationClient } from './client';
import { getCosmostationFromExtension } from './utils';

export class CosmostationExtensionWallet extends MainWallet {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmostationExtension);
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
