import { Callbacks, ChainRecord, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainCosmostationExtension } from './chain-wallet';
import { cosmostationExtensionInfo } from './registry';
import { Cosmostation } from './types';
import { CosmostationExtensionData } from './types';
import { getCosmostationFromExtension } from './utils';

export class CosmostationExtensionWallet extends MainWalletBase<
  Cosmostation,
  CosmostationExtensionData,
  ChainCosmostationExtension
> {
  constructor(
    walletInfo: Wallet = cosmostationExtensionInfo,
    chains?: ChainRecord[]
  ) {
    super(walletInfo, chains);
  }

  setChains(chains: ChainRecord[]): void {
    this._chainWallets = new Map(
      chains.map((chain) => {
        chain.preferredEndpoints = {
          rpc: [...(chain.preferredEndpoints?.rpc || [])],
          rest: [...(chain.preferredEndpoints?.rest || [])],
        };

        return [
          chain.name,
          new ChainCosmostationExtension(this.walletInfo, chain),
        ];
      })
    );
  }

  async fetchClient() {
    return await getCosmostationFromExtension();
  }

  async update(callbacks?: Callbacks) {
    this.setState(State.Done);
    callbacks?.connect?.();
  }
}
