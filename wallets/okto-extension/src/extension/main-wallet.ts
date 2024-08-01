import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainOktoExtension } from './chain-wallet';
import { OktoClient } from './client';
import { getOktoFromExtension } from './utils';

export class OktoExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainOktoExtension);
  }

  async initClient() {
    console.log("init Client from dApp")
    this.initingClient();
    try {
      const okto = await getOktoFromExtension();
      this.initClientDone(okto ? new OktoClient(okto) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
