import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWalletV2 } from '@cosmos-kit/walletconnect-v2';

import { ChainTrustMobile } from './chain-wallet';
import { TrustClient } from './client';

export class TrustMobileWallet extends WCWalletV2 {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainTrustMobile, TrustClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
