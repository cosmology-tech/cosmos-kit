import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCosmostationExtension } from './chain-wallet';
import { CosmostationClient } from './client';
import { CosmostationOptions } from './types';
import { getCosmostationFromExtension } from './utils';

export class CosmostationExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmostationExtension);
  }

  async initClient(options?: CosmostationOptions) {
    this.initingClient();
    try {
      const cosmostation = await getCosmostationFromExtension();
      this.initClientDone(
        cosmostation ? new CosmostationClient(cosmostation, options) : undefined
      );
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
