import { ChainName, ChainRegistry, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { ChainKeplr } from './chain-wallet';
import { KeplrData } from './types';
import { getKeplrFromExtension } from './utils';

export class ExtKeplrWallet extends MainWalletBase<Keplr, KeplrData, ChainKeplr> {
  protected _chains: Map<ChainName, ChainKeplr>;
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

  protected setChains(supportedChains: ChainRegistry[]): void {
    this._chains = new Map(
      supportedChains.map((chainRegistry) => [
        chainRegistry.name,
        new ChainKeplr(chainRegistry, this),
      ])
    );
  }

  async update() {
    this.setState(State.Pending);
    for (const chainName of this.chainNames) {
      const chainWallet = this.chains.get(chainName)!;
      // delete chainWallet.actions?.modalOpen;
      await chainWallet.update();
      if (chainWallet.isDone) {
        this.setData({
          username: chainWallet.username,
        });
        this.setState(State.Done);
        return;
      } else {
        console.error(`chain ${chainName} connection failed!`);
      }
    }
    this.setState(State.Error);
    this.setMessage(`Failed to connect keplr.`);
  }
}
