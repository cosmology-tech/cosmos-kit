import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainIframe } from './chain-wallet';
import { IframeClient } from './client';

export class IframeWallet extends MainWalletBase {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainIframe);
    this.preferredEndpoints = preferredEndpoints;
  }

  async initClient() {
    this.initingClient();

    if (window.top === window.self) {
      this.initClientError(
        new Error('This wallet must be used inside of an iframe.')
      );
      return;
    }

    this.initClientDone(new IframeClient(this));
  }
}
