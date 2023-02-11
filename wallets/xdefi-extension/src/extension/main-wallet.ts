import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainXDEFIExtension } from './chain-wallet';
import { XDEFIClient } from './client';
import { getXDEFIFromExtension } from './utils';

export class XDEFIExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainXDEFIExtension);
  }

  async initClient() {
    try {
      const xdefi = await getXDEFIFromExtension();
      this.client = xdefi ? new XDEFIClient(xdefi) : undefined;
    } catch (error) {
      this.setClientNotExist();
    }
  }
}
