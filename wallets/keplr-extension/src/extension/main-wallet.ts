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
      // The mobile-web Keplr client exists in the Keplr Mobile in-app browser.
      // Manually verify this here instead of setting `mobileDisabled` in the
      // registry wallet info.
      if (this.isMobile && keplr.mode !== 'mobile-web') {
        throw new Error(
          'This wallet is not supported on mobile, please use desktop browsers.'
        );
      }

      this.initClientDone(keplr ? new KeplrClient(keplr) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
