import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';

export class ChainNinjiExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
