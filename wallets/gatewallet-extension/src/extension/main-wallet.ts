import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainGatewalletExtension } from './chain-wallet';
import { GatewalletClient } from './client';
import { getGatewalletFromExtension } from './utils';

export class GatewalletExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainGatewalletExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      const gatewallet = await getGatewalletFromExtension();
      this.initClientDone(
        gatewallet ? new GatewalletClient(gatewallet) : undefined
      );
    } catch (error) {
      this.initClientError(error);
    }
  }
}
