import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

import { ChainTrustMobile } from './chain-wallet';
import { TrustClient } from './client';

export class TrustMobileWallet extends WCWallet {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainTrustMobile, TrustClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
