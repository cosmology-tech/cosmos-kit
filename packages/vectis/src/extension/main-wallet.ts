import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainVectisExtension } from './chain-wallet';
import { VectisClient } from './client';
import { getVectisFromExtension } from './utils';

export class VectisExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainVectisExtension);
  }

  async fetchClient() {
    try {
      const vectis = await getVectisFromExtension();
      return vectis ? new VectisClient(vectis) : undefined;
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }
}
