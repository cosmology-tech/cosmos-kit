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
  private _client?: Keplr;

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
