import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';
import { OWalletClient } from './client';

export class ChainOWalletMobile extends ChainWC {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo, OWalletClient);
  }
}
