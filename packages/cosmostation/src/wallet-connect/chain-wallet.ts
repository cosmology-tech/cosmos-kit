import { ChainRecord, ChainWalletConnect, Wallet } from '@cosmos-kit/core';

export class ChainCosmostationMobile extends ChainWalletConnect {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
