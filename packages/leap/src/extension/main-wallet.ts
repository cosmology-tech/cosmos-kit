import { ChainInfo, ChainName, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainLeapExtension } from './chain-wallet';
import { walletInfo } from './registry';
import { ChainLeapExtensionData, Leap, LeapExtensionData } from './types';
import { getLeapFromExtension } from './utils';

export class LeapExtensionWallet extends MainWalletBase<
  Leap,
  LeapExtensionData,
  ChainLeapExtensionData,
  ChainLeapExtension
> {
  protected _chains!: Map<ChainName, ChainLeapExtension>;
  protected _client: Promise<Leap | undefined> | undefined;

  constructor(_walletInfo: Wallet = walletInfo, _chainsInfo?: ChainInfo[]) {
    super(_walletInfo, _chainsInfo);
    this._client = (async () => {
      try {
        return await getLeapFromExtension();
      } catch (e) {
        return undefined;
      }
    })();
  }

  setChains(chainsInfo: ChainInfo[]): void {
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
