import { ChainRecord, ChainWallet, Wallet } from '@cosmos-kit/core';

export class ChainKeplrExtension extends ChainWallet {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
