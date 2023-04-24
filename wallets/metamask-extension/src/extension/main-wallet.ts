import { Wallet, WalletClientOptions } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainMetamaskExtension } from './chain-wallet';
import { MetamaskClient } from './client';
import { getMetamaskFromExtension } from './utils';

export class MetamaskExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainMetamaskExtension);
  }

  async initClient(options?: WalletClientOptions) {
    this.initingClient();
    try {
      const metamask = await getMetamaskFromExtension();
      this.initClientDone(
        metamask ? new MetamaskClient(metamask, options) : undefined
      );
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
