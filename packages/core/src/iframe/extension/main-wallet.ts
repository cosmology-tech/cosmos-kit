import { MainWalletBase } from '../../bases';
import { EndpointOptions, Wallet } from '../../types';
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

    if (window.parent === window.self) {
      this.initClientError(
        new Error('This wallet must be used inside of an iframe.')
      );
      return;
    }

    this.initClientDone(new IframeClient(this));
  }
}
