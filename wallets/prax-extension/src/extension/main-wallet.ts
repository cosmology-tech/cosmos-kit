import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { createPenumbraClient } from '@penumbra-zone/client';

import { PRAX_ORIGIN } from '../constant.js';
import { ChainPraxExtension } from './chain-wallet.js';
import { PraxClient } from './client.js';

export class PraxExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainPraxExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const penumbra = createPenumbraClient();
      await penumbra.attach(PRAX_ORIGIN);

      this.initClientDone(new PraxClient(penumbra));
    } catch (error) {
      this.initClientError(error);
    }
  }
}
