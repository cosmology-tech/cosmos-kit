import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

import { ChainOmniMobile } from './chain-wallet';
import { OmniClient } from './client';

export class OmniMobileWallet extends WCWallet {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainOmniMobile, OmniClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
