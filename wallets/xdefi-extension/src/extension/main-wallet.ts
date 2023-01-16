import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainXDEFIExtension } from './chain-wallet';
import { XDEFIClient } from './client';
import { getXDEFIFromExtension } from './utils';

export class XDEFIExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainXDEFIExtension);
  }

  async fetchClient() {
    try {
      const xdefi = await getXDEFIFromExtension();
      return xdefi ? new XDEFIClient(xdefi) : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
