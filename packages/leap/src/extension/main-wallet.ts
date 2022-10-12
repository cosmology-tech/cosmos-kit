import {
  ChainRecord,
  ClientNoExistError,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { walletRegistry } from './registry';
import { Leap, LeapExtensionData } from './types';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase<
  Leap,
  LeapExtensionData,
  ChainLeapExtension
> {
  constructor(walletInfo: Wallet = walletRegistry, chains?: ChainRecord[]) {
    super(walletInfo, chains);
  }

  setChains(chains: ChainRecord[]): void {
    this._chainWallets = new Map(
      chains.map((chain) => {
        chain.preferredEndpoints = {
          rpc: [...(chain.preferredEndpoints?.rpc || [])],
          rest: [...(chain.preferredEndpoints?.rest || [])],
        };

        return [chain.name, new ChainLeapExtension(this.walletInfo, chain)];
      })
    );
  }

  async update() {
    try {
      if (!this.client) {
        this._client = await getLeapFromExtension();
      }
      console.log(123, this.client);
      this.setState(State.Done);
    } catch (error) {
      console.log('%cmain-wallet.ts line:52 error', 'color: #007acc;', error);
      throw ClientNoExistError;
    }
  }
}
