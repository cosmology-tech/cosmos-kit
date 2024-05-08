import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

import { ChainFoxWalletMobile } from './chain-wallet';
import { FoxWalletClient } from './client';

export class FoxWalletMobileWallet extends WCWallet {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainFoxWalletMobile, FoxWalletClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
