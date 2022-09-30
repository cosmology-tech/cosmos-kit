import { ChainInfo, ChainName, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { preferredEndpoints } from '../config';
import { ChainKeplrExtension } from './chain-wallet';
import { walletInfo } from './registry';
import { ChainKeplrExtensionData, KeplrExtensionData } from './types';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase<
  Keplr,
  KeplrExtensionData,
  ChainKeplrExtensionData,
  ChainKeplrExtension
> {
  protected _chains!: Map<ChainName, ChainKeplrExtension>;
  protected _client: Promise<Keplr | undefined> | undefined;

  constructor(_walletInfo: Wallet = walletInfo, _chainsInfo?: ChainInfo[]) {
    super(_walletInfo, _chainsInfo);
    this._client = (async () => {
      try {
        return await getKeplrFromExtension();
      } catch (e) {
        return undefined;
      }
    })();
  }

  setChains(chainsInfo: ChainInfo[]): void {
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
