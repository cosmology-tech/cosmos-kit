import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

import { ChainCosmostationMobile } from './chain-wallet';
import { CosmostationClient } from './client';

export class CosmostationMobileWallet extends WCWallet {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainCosmostationMobile, CosmostationClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
