import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCosmjsExtension } from './chain-wallet';
import { CosmjsClient } from './client';
import { getCosmjsFromExtension } from './utils';

export class CosmjsExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet, mnemonic?: string) {
    super(walletInfo, ChainCosmjsExtension);
    this.initClient(mnemonic);
  }

  async initClient(mnemonic) {
    this.initingClient();
    try {
      const cosmjs = await getCosmjsFromExtension();
      // this.initClientDone(cosmjs ? new CosmjsClient(cosmjs) : undefined);
      this.initClientDone(new CosmjsClient(cosmjs, mnemonic));
    } catch (error) {
      this.initClientError(error);
    }
  }
}
