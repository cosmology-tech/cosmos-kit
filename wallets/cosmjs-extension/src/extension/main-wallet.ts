import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCosmjsExtension } from './chain-wallet';
import { CosmjsClient } from './client';
import { getCosmjsFromExtension } from './utils';

export class CosmjsExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmjsExtension);
    this.initClient();
  }

  async initClient() {
    this.initingClient();
    try {
      const cosmjs = await getCosmjsFromExtension();
      // this.initClientDone(cosmjs ? new CosmjsClient(cosmjs) : undefined);
      this.initClientDone(new CosmjsClient(cosmjs));
    } catch (error) {
      this.initClientError(error);
    }
  }
}
