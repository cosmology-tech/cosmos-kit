import { ChainRecord, ChainWCV2, Wallet } from '@cosmos-kit/core';

export class ChainOmniMobile extends ChainWCV2 {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
