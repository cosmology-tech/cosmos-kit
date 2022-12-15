import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWalletV1 } from '@cosmos-kit/walletconnect-v1';

import { ChainKeplrMobile } from './chain-wallet';
import { KeplrClient } from './client';

export class KeplrMobileWallet extends WCWalletV1 {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainKeplrMobile, KeplrClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
