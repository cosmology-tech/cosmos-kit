import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCTRLExtension } from './chain-wallet';
import { CTRLClient } from './client';
import { getCTRLFromExtension } from './utils';

export class CTRLExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCTRLExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const ctrl = await getCTRLFromExtension();
      this.initClientDone(ctrl ? new CTRLClient(ctrl) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
