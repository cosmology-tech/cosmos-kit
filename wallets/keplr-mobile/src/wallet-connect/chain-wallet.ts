import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';

import { KeplrClient } from './client';

export class ChainKeplrMobile extends ChainWC {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(walletInfo, chainInfo, KeplrClient);
  }
}
