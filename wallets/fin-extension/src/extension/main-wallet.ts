import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { FinClient } from './client';
import { getFinFromExtension } from './utils';
import { ChainFinExtension } from './chain-wallet';

export class FinExtensionWallet extends MainWalletBase {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainFinExtension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async initClient() {
    this.initingClient();
    try {
      const fin = await getFinFromExtension();
      this.initClientDone(fin ? new FinClient(fin) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
