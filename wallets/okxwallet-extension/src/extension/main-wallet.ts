import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainOkxwalletExtension } from './chain-wallet';
import { OkxwalletClient } from './client';
import { getOkxwalletFromExtension } from './utils';

export class OkxwalletExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainOkxwalletExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const okxwallet = await getOkxwalletFromExtension();
      this.initClientDone(
        okxwallet ? new OkxwalletClient(okxwallet) : undefined
      );
    } catch (error) {
      this.initClientError(error);
    }
  }
}
