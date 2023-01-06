import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWalletV2 } from '@cosmos-kit/walletconnect-v2';

import { ChainOmniMobile } from './chain-wallet';
import { OmniClient } from './client';

export class OmniMobileWallet extends WCWalletV2 {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainOmniMobile, OmniClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
