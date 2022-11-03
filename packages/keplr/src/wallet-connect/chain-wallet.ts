/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { KeplrClient } from '../client';

export class ChainKeplrMobile extends ChainWalletBase {
  client?: KeplrClient;
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
