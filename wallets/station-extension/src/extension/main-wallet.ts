import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainStationExtension } from './chain-wallet';
import { StationClient } from './client';
import { getTerraFromExtension } from './utils';

export class StationExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainStationExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const terra = await getTerraFromExtension();
      this.initClientDone(terra ? new StationClient(terra) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
