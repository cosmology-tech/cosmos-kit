import { Wallet } from '@cosmos-kit/core';
import { WCWalletV1 } from '@cosmos-kit/walletconnect-v1';

import { ChainCosmostationMobile } from './chain-wallet';
import { CosmostationClient } from './client';

export class CosmostationMobileWallet extends WCWalletV1 {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmostationMobile, CosmostationClient);
  }
}
