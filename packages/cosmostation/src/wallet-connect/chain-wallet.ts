import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWCV1 } from '../../../w';

export class ChainCosmostationMobile extends ChainWCV1 {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
