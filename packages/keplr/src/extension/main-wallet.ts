import { ChainName, ChainRegistry, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { ChainExtKeplr } from './chain-wallet';
import { ExtKeplrData } from './types';
import { getKeplrFromExtension } from './utils';

export class ExtKeplrWallet extends MainWalletBase<Keplr, ExtKeplrData, ChainExtKeplr> {
  protected _chains: Map<ChainName, ChainExtKeplr>;
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
        new ChainExtKeplr(chainRegistry, this),
      ])
    );
  }

  async update() {
    this.setState(State.Pending);
    // let message;
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
    // this.setState(State.Error);
    // this.setMessage(message);
  }
}
