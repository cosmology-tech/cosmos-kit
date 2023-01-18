import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';

import { IChainWCV2, IWCClientV2 } from './types';

export class WCWalletV2 extends MainWalletBase {
  WCClient: IWCClientV2;
  wcSignClientOptions?: SignClientTypes.Options | undefined;

  constructor(walletInfo: Wallet, ChainWC: IChainWCV2, WCClient: IWCClientV2) {
    if (!walletInfo.wcProjectId) {
      throw new Error(
        `'wcProjectId' for wallet ${walletInfo.name} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC);
    this.WCClient = WCClient;
  }

  setWCSignClientOptions(
    wcSignClientOptions: SignClientTypes.Options | undefined
  ): void {
    this.wcSignClientOptions = wcSignClientOptions;
  }

  async fetchClient() {
    if (!this.wcSignClientOptions) {
      return void 0;
    }
    try {
      const client = new this.WCClient(
        this.walletInfo,
        this.wcSignClientOptions.projectId
      );
      await client.initWCWalletInfo();
      await client.initSignClient(this.wcSignClientOptions);
    } catch (error) {
      this.setError(error as Error);
      return void 0;
    }
  }
}
