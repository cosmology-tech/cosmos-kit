import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainIMTokenExtension } from './chain-wallet';
import { IMTokenClient } from './client';
import { getIMTokenFromExtension } from './utils';

export class IMTokenWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainIMTokenExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const imToken = await getIMTokenFromExtension();
      this.initClientDone(imToken ? new IMTokenClient(imToken) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
