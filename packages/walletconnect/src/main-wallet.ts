import {
  Mutable,
  State,
  Wallet,
  WalletClient,
  WalletConnectOptions,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { WCClient } from './client';

import { IChainWC, IWCClient } from './types';

export class WCWallet extends MainWalletBase {
  WCClient: IWCClient;
  clientMutable: Mutable<WCClient> = { state: State.Init };

  constructor(walletInfo: Wallet, ChainWC: IChainWC, WCClient: IWCClient) {
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC);
    this.WCClient = WCClient;
  }

  async initClient(options?: WalletConnectOptions) {
    if (!options) {
      throw new Error(
        'Please provide `walletconnectOptions` in `ChainProvider` Properties.'
      );
    }

    this.initingClient();

    try {
      const client = new this.WCClient(this.walletInfo);
      client.logger = this.logger;
      client.emitter = this.emitter;
      client.env = this.env;
      client.options = options;
      await client.init();

      this.initClientDone(client);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
