import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainTerraExtension } from './chain-wallet';
import { TerraClient } from './client';
import { getTerraFromExtension } from './utils';

export class TerraExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainTerraExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const terra = await getTerraFromExtension();
      this.initClientDone(terra ? new TerraClient(terra) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
