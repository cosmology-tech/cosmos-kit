import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWCV2 } from '@cosmos-kit/walletconnect-v2';

export class ChainTrustMobile extends ChainWCV2 {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
