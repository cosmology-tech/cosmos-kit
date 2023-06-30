import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainExodusExtension } from './chain-wallet';
import { ExodusClient } from './client';
import { getExodusFromExtension } from './utils';

export class ExodusExtensionWallet extends MainWalletBase {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    super(walletInfo, ChainExodusExtension);
    this.preferredEndpoints = preferredEndpoints;
  }

  async initClient() {
    this.initingClient();
    try {
      const exodus = await getExodusFromExtension();
      if (!exodus?.cosmos) {
        throw new Error('Exodus client does not support Cosmos provider');
      }
      this.initClientDone(exodus ? new ExodusClient(exodus.cosmos) : undefined);
    } catch (error: unknown) {
      this.logger?.error(error);
      this.initClientError(error as Error);
    }
  }
}
