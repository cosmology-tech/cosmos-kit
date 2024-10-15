import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

import { ChainOWalletMobile } from './chain-wallet';
import { OWalletClient } from './client';

export class OWalletMobileWallet extends WCWallet {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainOWalletMobile, OWalletClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
