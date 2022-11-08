import EventEmitter from 'events';

import { ChainRecord, ChainWalletBase, Wallet, WalletConnectClient } from '..';

export class ChainWalletConnect extends ChainWalletBase {
  client?: WalletConnectClient;
  emitter?: EventEmitter;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get connector() {
    return this.client?.connector;
  }

  get qrUrl() {
    return this.connector?.uri;
  }

  get appUrl() {
    if (!this.env?.os) {
      return void 0;
    }
    return this.client?.getAppUrl(this.env.os);
  }
}
