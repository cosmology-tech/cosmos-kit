import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainKeplrExtension } from './chain-wallet';
import { KeplrClient } from './client';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainKeplrExtension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async initClient() {
    this.initingClient();
    try {
      const keplr = await getKeplrFromExtension();
      this.initClientDone(keplr ? new KeplrClient(keplr) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
