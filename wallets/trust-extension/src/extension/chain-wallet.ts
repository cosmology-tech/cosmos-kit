import { ChainRecord, ChainWallet, Wallet } from '@cosmos-kit/core';

export class ChainTrustExtension extends ChainWallet {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
