/* eslint-disable no-console */
import { ChainRecord, ChainWallet, Wallet } from '@cosmos-kit/core';

export class ChainCosmostationExtension extends ChainWallet {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
