import { ChainName, ChainRecord, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { preferredEndpoints } from '../config';

import { ChainKeplrExtension } from './chain-wallet';
import { ChainKeplrExtensionData, KeplrExtensionData } from './types';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase<Keplr, KeplrExtensionData, ChainKeplrExtensionData, ChainKeplrExtension> {
  protected _chains!: Map<ChainName, ChainKeplrExtension>;
  protected _client: Promise<Keplr | undefined> | undefined;

  constructor(_concurrency?: number) {
    super(_concurrency);
    this._client = (async () => {
      try {
        return await getKeplrFromExtension();
      } catch (e) {
        return undefined;
      }
    })();
  }

  protected setChains(supportedChains: ChainRecord[]): void {
    this._chains = new Map(
      supportedChains.map((chainRecord) => {

        chainRecord.preferredEndpoints = {
          rpc: [
            ...chainRecord.preferredEndpoints?.rpc || [],
            ...preferredEndpoints[chainRecord.name]?.rpc || []
          ],
          rest: [
            ...chainRecord.preferredEndpoints?.rest || [],
            ...preferredEndpoints[chainRecord.name]?.rest || []
          ]
        }

        return [
        chainRecord.name,
        new ChainKeplrExtension(chainRecord, this),
      ]
    })
    );
  }

  async update() {
    this.setState(State.Done);
  }
}
