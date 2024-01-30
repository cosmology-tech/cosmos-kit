import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainInitiaExtension } from './chain-wallet';
import { InitiaClient } from './client';
import { getInitiaFromExtension } from './utils';

export class InitiaExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainInitiaExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const initia = await getInitiaFromExtension();
      this.initClientDone(initia ? new InitiaClient(initia) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
