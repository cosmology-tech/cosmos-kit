import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWalletV2 } from '@cosmos-kit/walletconnect-v2';

import { ChainCosmostationMobile } from './chain-wallet';
import { CosmostationClient } from './client';

export class CosmostationMobileWallet extends WCWalletV2 {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainCosmostationMobile, CosmostationClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
