import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

import { ChainOwalletMobile } from './chain-wallet';
import { OwalletClient } from './client';

export class OwalletMobileWallet extends WCWallet {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainOwalletMobile, OwalletClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
