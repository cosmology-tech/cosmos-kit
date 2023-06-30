import { MainWalletBase } from '@cosmos-kit/core';
import { OPENLOGIN_NETWORK } from '@toruslabs/openlogin';

import { Web3AuthChainWallet } from './chain-wallet';
import { Web3AuthClient } from './client';
import { Web3AuthWalletInfo } from './types';

export class Web3AuthWallet extends MainWalletBase {
  constructor(walletInfo: Web3AuthWalletInfo) {
    super(walletInfo, Web3AuthChainWallet);
  }

  get walletInfo(): Web3AuthWalletInfo {
    return this._walletInfo as Web3AuthWalletInfo;
  }

  async initClient() {
    const { options } = this.walletInfo;
    try {
      if (!options) {
        throw new Error('Web3auth options unset');
      }

      if (typeof options.client?.clientId !== 'string') {
        throw new Error('Invalid web3auth client ID');
      }

      if (
        typeof options.client?.web3AuthNetwork !== 'string' ||
        !Object.values(OPENLOGIN_NETWORK).includes(
          options.client.web3AuthNetwork
        )
      ) {
        throw new Error('Invalid web3auth network');
      }

      if (typeof options.promptSign !== 'function') {
        throw new Error('Invalid promptSign function');
      }
    } catch (err) {
      this.initClientError(err);
      return;
    }

    this.initingClient();
    try {
      const client = await Web3AuthClient.setup(this.env, options);
      this.initClientDone(client);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}
