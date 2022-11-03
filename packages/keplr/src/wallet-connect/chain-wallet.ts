/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { KeplrClient } from '../client';
import { getAppUrlFromQrUri } from './utils';

export class ChainKeplrMobile extends ChainWalletBase {
  client?: KeplrClient;
  connector?: WalletConnect;
  emitter?: EventEmitter;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get qrUri() {
    return this.connector.uri;
  }

  get appUrl() {
    return getAppUrlFromQrUri(this.qrUri);
  }
}
