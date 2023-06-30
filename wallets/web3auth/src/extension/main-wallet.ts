import { MainWalletBase, Wallet } from '@cosmos-kit/core';
import { OPENLOGIN_NETWORK } from '@toruslabs/openlogin';

import { Web3AuthChainWallet } from './chain-wallet';
import { Web3AuthClient } from './client';
import { Web3AuthClientOptions } from './types';

export class Web3AuthWallet extends MainWalletBase {
  options: Web3AuthClientOptions;

  constructor(walletInfo: Wallet, options: Web3AuthClientOptions) {
    super(walletInfo, Web3AuthChainWallet);
    this.options = options;
  }

  async initClient() {
    try {
      if (typeof this.options.client?.clientId !== 'string') {
        throw new Error('Invalid web3auth client ID');
      }

      if (
        typeof this.options.client?.web3AuthNetwork !== 'string' ||
        !Object.values(OPENLOGIN_NETWORK).includes(
          this.options.client.web3AuthNetwork
        )
      ) {
        throw new Error('Invalid web3auth network');
      }

      if (typeof this.options.promptSign !== 'function') {
        throw new Error('Invalid promptSign function');
      }
    } catch (err) {
      this.initClientError(err);
      return;
    }

    this.initingClient();
    try {
      const client = await Web3AuthClient.setup(this.env, this.options);
      this.initClientDone(client);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
