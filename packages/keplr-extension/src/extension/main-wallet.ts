import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainKeplrExtension } from './chain-wallet';
import { KeplrClient } from './client';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainKeplrExtension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async fetchClient() {
    try {
      const keplr = await getKeplrFromExtension();
      return keplr ? new KeplrClient(keplr) : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
