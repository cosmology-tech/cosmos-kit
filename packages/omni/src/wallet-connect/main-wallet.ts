import {
  EndpointOptions,
  Wallet,
  WalletConnectWalletV2,
} from '@cosmos-kit/core';

import { ChainOmniMobile } from './chain-wallet';
import { OmniClient } from './client';

export class OmniMobileWallet extends WalletConnectWalletV2 {
  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainOmniMobile, OmniClient);
    this.preferredEndpoints = preferredEndpoints;
  }
}
