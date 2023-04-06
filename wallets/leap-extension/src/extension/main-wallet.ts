import { Wallet } from '@cosmos-kit/core';
import { MainWallet } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { LeapClient } from './client';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWallet {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainLeapExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const leap = await getLeapFromExtension();
      this.initClientDone(leap ? new LeapClient(leap) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
