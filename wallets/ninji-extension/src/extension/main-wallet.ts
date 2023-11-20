import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainNinjiExtension } from './chain-wallet';
import { NinjiClient } from './client';
import { getNinjiFromExtension } from './utils';

export class NinjiExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainNinjiExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const ninji = await getNinjiFromExtension();
      this.initClientDone(ninji ? new NinjiClient(ninji) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
