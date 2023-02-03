import { Wallet, WalletConnectOptions } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { IChainWCV2, IWCClientV2 } from './types';

export class WCWalletV2 extends MainWalletBase {
  WCClient: IWCClientV2;
  protected options?: WalletConnectOptions | undefined;

  constructor(
    walletInfo: Wallet,
    ChainWC: IChainWCV2,
    WCClient: IWCClientV2,
    options?: WalletConnectOptions
  ) {
    if (!walletInfo.walletConnectProjectId) {
      throw new Error(
        `'walletConnectProjectId' for wallet ${walletInfo.name} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC);
    this.WCClient = WCClient;
    this.options = options;
  }

  setWalletConnectOptions(options: WalletConnectOptions | undefined): void {
    this.options = options;
  }

  async fetchClient() {
    if (!this.options?.signClient) {
      return void 0;
    }
    try {
      const client = new this.WCClient(
        this.walletInfo,
        this.options.signClient.projectId
      );
      await client.initWCWalletInfo();
      await client.initSignClient(this.options.signClient);
      return client;
    } catch (error) {
      this.setError(error as Error);
      return void 0;
    }
  }
}
