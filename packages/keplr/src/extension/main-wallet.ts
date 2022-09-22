import { ChainName, ChainRecord, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { ChainKeplrExtension } from './chain-wallet';
import { ChainKeplrExtensionData, KeplrExtensionData } from './types';
import { getKeplrFromExtension } from './utils';

export class KeplrExtensionWallet extends MainWalletBase<Keplr, KeplrExtensionData, ChainKeplrExtensionData, ChainKeplrExtension> {
  protected _chains: Map<ChainName, ChainKeplrExtension>;
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
      supportedChains.map((chainRecord) => [
        chainRecord.name,
        new ChainKeplrExtension(chainRecord, this),
      ])
    );
  }

  async update() {
    this.setState(State.Pending);
    for (const chainName of this.chainNames) {
      const chainWallet = this.chains.get(chainName)!;
      await chainWallet.update();
      if (chainWallet.isDone) {
        this.setData({
          username: chainWallet.username,
        });
        this.setState(State.Done);
        return;
      } else {
        this.setMessage(chainWallet.message);
        this.setState(chainWallet.state);
      }
      break
    }
  }
}
