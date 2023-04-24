import { Wallet, WalletClientOptions } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainFrontierExtension } from './chain-wallet';
import { FrontierClient } from './client';
import { getFrontierFromExtension } from './utils';

export class FrontierExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainFrontierExtension);
  }

  async initClient(options?: WalletClientOptions) {
    this.initingClient();
    try {
      const frontier = await getFrontierFromExtension();
      this.initClientDone(
        frontier ? new FrontierClient(frontier, options) : undefined
      );
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
