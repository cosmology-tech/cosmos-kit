/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { CosmostationClient } from '../client';

export class ChainCosmostationMobile extends ChainWalletBase {
  client?: CosmostationClient;
  connector?: WalletConnect;
  emitter?: EventEmitter;
  appUrl?: string;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get isInSession() {
    return this.connector?.connected;
  }

  get qrUri() {
    return this.connector?.uri;
  }
}
