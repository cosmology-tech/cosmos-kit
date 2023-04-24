/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';

export class ChainCosmostationExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
