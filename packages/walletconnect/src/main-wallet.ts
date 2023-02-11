import { Wallet, WalletConnectOptions } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';
import { WCClient } from './client';

import { IChainWC, IWCClient } from './types';

export class WCWallet extends MainWalletBase {
  WCClient: IWCClient;
  client?: WCClient;

  constructor(walletInfo: Wallet, ChainWC: IChainWC, WCClient: IWCClient) {
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC);
    this.WCClient = WCClient;
    this.initClient();
  }

  async initClient(options?: WalletConnectOptions) {
    if (!this.client && this.WCClient) {
      this.client = new this.WCClient(this.walletInfo);
      this.client.emitter = this.emitter;
    }

    this.client.logger = this.logger;

    if (options) {
      this.client.options = options;
      await this.client.initSignClient();
    }
  }
}
