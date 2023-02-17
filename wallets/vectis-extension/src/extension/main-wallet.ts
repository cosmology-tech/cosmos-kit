import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainVectisExtension } from './chain-wallet';
import { VectisClient } from './client';
import { getVectisFromExtension } from './utils';

export class VectisExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainVectisExtension);
  }

  async initClient() {
    try {
      const vectis = await getVectisFromExtension();
      this.client = vectis ? new VectisClient(vectis) : undefined;
    } catch (error) {
      this.logger?.error(error);
    }
  }
}
