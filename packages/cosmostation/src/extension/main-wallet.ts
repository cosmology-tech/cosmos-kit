import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { CosmostationClient } from '../client';
import { ChainCosmostationExtension } from './chain-wallet';
import { getCosmostationFromExtension } from './utils';

export class CosmostationExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmostationExtension);
  }

  async fetchClient() {
    try {
      const cosmostation = await getCosmostationFromExtension();
      return cosmostation
        ? new CosmostationClient(cosmostation, this.walletInfo.mode)
        : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
