import { ChainRecord, ChainWalletConnectV2, Wallet } from '@cosmos-kit/core';

export class ChainOmniMobile extends ChainWalletConnectV2 {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
