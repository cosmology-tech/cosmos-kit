import { Wallet } from '@cosmos-kit/core';
import { MainWallet } from '@cosmos-kit/core';

import { ChainVectisExtension } from './chain-wallet';
import { VectisClient } from './client';
import { getVectisFromExtension } from './utils';

export class VectisExtensionWallet extends MainWallet {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainVectisExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const vectis = await getVectisFromExtension();
      this.initClientDone(vectis ? new VectisClient(vectis) : undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
