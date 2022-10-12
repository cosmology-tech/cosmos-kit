import {
  ChainRecord,
  ClientNoExistError,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { preferredEndpoints } from '../config';
import { ChainKeplrExtension } from './chain-wallet';
import { walletRegistry } from './registry';
import { KeplrExtensionData } from './types';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase<
  Keplr,
  KeplrExtensionData,
  ChainKeplrExtension
> {
  constructor(walletInfo: Wallet = walletRegistry, chains?: ChainRecord[]) {
    super(walletInfo, chains);
  }

  setChains(chains: ChainRecord[]): void {
    this._chainWallets = new Map(
      chains.map((chain) => {
        chain.preferredEndpoints = {
          rpc: [
            ...(chain.preferredEndpoints?.rpc || []),
            ...(preferredEndpoints[chain.name]?.rpc || []),
          ],
          rest: [
            ...(chain.preferredEndpoints?.rest || []),
            ...(preferredEndpoints[chain.name]?.rest || []),
          ],
        };

        return [chain.name, new ChainKeplrExtension(this.walletInfo, chain)];
      })
    );
  }

  async update() {
    try {
      if (!this.client) {
        this._client = await getKeplrFromExtension();
      }
      this.setState(State.Done);
    } catch (error) {
      throw ClientNoExistError;
    }
  }
}
