import { ChainRecord, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { leapExtensionInfo } from './registry';
import { Leap, LeapExtensionData } from './types';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase<
  Leap,
  LeapExtensionData,
  ChainLeapExtension
> {
  constructor(walletInfo: Wallet = leapExtensionInfo, chains?: ChainRecord[]) {
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

  async fetchClient() {
    return await getLeapFromExtension();
  }

  update() {
    this.setState(State.Done);
  }
}
