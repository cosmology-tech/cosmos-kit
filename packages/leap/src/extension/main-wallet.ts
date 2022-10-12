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
  private _client?: Leap;

  constructor(
    walletInfo: Wallet = walletRegistry,
    chainRecords?: ChainRecord[]
  ) {
    super(walletInfo, chainRecords);
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
    try {
      if (!this.client) {
        this._client = await getLeapFromExtension();
      }
      this.setState(State.Done);
    } catch (error) {
      throw ClientNoExistError;
    }
  }
}
