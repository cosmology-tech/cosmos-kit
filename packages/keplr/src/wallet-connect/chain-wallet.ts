import { ChainRecord, ChainWalletConnect, Wallet } from '@cosmos-kit/core';

export class ChainKeplrMobile extends ChainWalletConnect {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
