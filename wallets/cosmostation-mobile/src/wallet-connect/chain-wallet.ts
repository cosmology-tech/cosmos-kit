import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';
import { CosmostationClient } from './client';

export class ChainCosmostationMobile extends ChainWC {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo, CosmostationClient);
  }
}
