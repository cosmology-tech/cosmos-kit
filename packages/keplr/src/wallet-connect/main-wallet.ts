import { EndpointOptions, Wallet, WalletConnectWallet } from '@cosmos-kit/core';

import { ChainKeplrMobile } from './chain-wallet';
import { KeplrClient } from './client';

export class KeplrMobileWallet extends WalletConnectWallet {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainKeplrMobile, KeplrClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
