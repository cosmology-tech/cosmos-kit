/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { CosmostationClient } from '../client';
import { getAppUrl } from './utils';

export class ChainCosmostationMobile extends ChainWalletBase {
  client?: CosmostationClient;
  connector?: WalletConnect;
  emitter?: EventEmitter;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get qrUri() {
    return this.connector?.uri;
  }

  get appUrl() {
    return getAppUrl(this.qrUri, this.env);
  }
}
