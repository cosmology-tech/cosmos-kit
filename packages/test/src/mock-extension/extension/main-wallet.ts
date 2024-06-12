import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainMockExtension } from './chain-wallet';
import { MockClient } from './client';
import { getMockFromExtension } from './utils';

export class MockExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainMockExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const mock = await getMockFromExtension();
      // @ts-ignore
      this.initClientDone(mock ? new MockClient(mock) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
