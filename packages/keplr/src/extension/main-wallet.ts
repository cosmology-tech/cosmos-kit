import { ChainRecord, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

import { preferredEndpoints } from '../config';
import { ChainKeplrExtension } from './chain-wallet';
import { keplrExtensionInfo } from './registry';
import { KeplrExtensionData } from './types';

export class KeplrExtensionWallet extends MainWalletBase<
  Keplr,
  KeplrExtensionData,
  ChainKeplrExtension
> {
  constructor(
    _walletInfo: Wallet = keplrExtensionInfo,
    _chainsInfo?: ChainRecord[]
  ) {
    super(_walletInfo, _chainsInfo);
  }

  get client(): Keplr | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    } else {
      return (window as KeplrWindow).keplr;
    }
  }

  setChains(chainsInfo: ChainRecord[]): void {
    this._chains = new Map(
      chainsInfo.map((chain) => {
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

        return [chain.name, new ChainKeplrExtension(chain, this)];
      })
    );
  }

  async update() {
    this.setState(State.Done);
  }
}
