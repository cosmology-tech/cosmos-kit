import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { LeapClient } from '../client';
import { ChainLeapExtension } from './chain-wallet';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainLeapExtension);
  }

  async fetchClient() {
    try {
      const leap = await getLeapFromExtension();
      return leap ? new LeapClient(leap, this.walletInfo.mode) : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
