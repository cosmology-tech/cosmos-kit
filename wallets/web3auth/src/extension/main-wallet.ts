import { MainWalletBase, Wallet } from '@cosmos-kit/core';

import { Web3AuthChainWallet } from './chain-wallet';
import { Web3AuthClient } from './client';

export class Web3AuthWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, Web3AuthChainWallet);
  }

  async initClient() {
    this.initingClient();
    try {
      this.initClientDone(new Web3AuthClient());
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
