import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { KeplrClient } from '../client';
import { ChainKeplrExtension } from './chain-wallet';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainKeplrExtension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async fetchClient() {
    const keplr = await getKeplrFromExtension();
    return keplr ? new KeplrClient(keplr, 'extension') : undefined;
  }
}
