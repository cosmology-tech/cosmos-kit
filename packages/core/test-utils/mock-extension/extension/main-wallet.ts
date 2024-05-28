
import { MainWalletBase } from '../../../src/bases';
import { Wallet } from '../../../src/types';
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
      this.initClientDone(mock ? new MockClient(mock) : undefined);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
