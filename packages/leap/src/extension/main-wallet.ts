import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { LeapClient } from './client';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainLeapExtension);
  }

  async fetchClient() {
    try {
      const leap = await getLeapFromExtension();
      return leap ? new LeapClient(leap) : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
