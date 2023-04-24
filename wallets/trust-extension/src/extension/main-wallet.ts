import { Wallet, WalletClientOptions } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainTrustExtension } from './chain-wallet';
import { TrustClient } from './client';
import { getTrustFromExtension } from './utils';

export class TrustExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainTrustExtension);
  }

  async initClient(options?: WalletClientOptions) {
    this.initingClient();
    try {
      const trust = await getTrustFromExtension();
      this.initClientDone(trust ? new TrustClient(trust, options) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
