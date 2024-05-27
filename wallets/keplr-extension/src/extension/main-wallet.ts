import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/provider-extension';

import { ChainKeplrExtension } from './chain-wallet';
import { KeplrClient } from './client';

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
      const keplr = await Keplr.getKeplr();
      this.initClientDone(keplr ? new KeplrClient(keplr) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
