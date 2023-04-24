import { Wallet, WalletClientOptions } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { LeapClient } from './client';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainLeapExtension);
  }

  async initClient(options?: WalletClientOptions) {
    this.initingClient();
    try {
      const leap = await getLeapFromExtension();
      this.initClientDone(leap ? new LeapClient(leap, options) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
