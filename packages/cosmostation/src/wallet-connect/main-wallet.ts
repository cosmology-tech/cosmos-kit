import { Wallet, WalletConnectWallet } from '@cosmos-kit/core';

import { ChainCosmostationMobile } from './chain-wallet';
import { CosmostationClient } from './client';

export class CosmostationMobileWallet extends WalletConnectWallet {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmostationMobile, CosmostationClient);
  }
}
