import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainOmniExtension } from './chain-wallet';
import { OmniClient } from './client';
import { getOmniFromExtension } from './utils';

export class OmniExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainOmniExtension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async fetchClient() {
    try {
      const omni = await getOmniFromExtension();
      return omni ? new OmniClient(omni) : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
