import { ChainRecord, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { walletInfo } from './registry';
import { Leap, LeapExtensionData } from './types';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase<
  Leap,
  LeapExtensionData,
  ChainLeapExtension
> {
  private _client: Promise<Leap | undefined>;

  constructor(_walletInfo: Wallet = walletInfo, _chainsInfo?: ChainRecord[]) {
    super(_walletInfo, _chainsInfo);
    this._client = (async () => {
      try {
        return await getLeapFromExtension();
      } catch (e) {
        return undefined;
      }
    })();
  }

  get client() {
    return this._client;
  }

  setChains(chainsInfo: ChainRecord[]): void {
    this._chains = new Map(
      chainsInfo.map((chain) => {
        chain.preferredEndpoints = {
          rpc: [...(chain.preferredEndpoints?.rpc || [])],
          rest: [...(chain.preferredEndpoints?.rest || [])],
        };

        return [chain.name, new ChainLeapExtension(chain, this)];
      })
    );
  }

  async update() {
    this.setState(State.Done);
  }
}
