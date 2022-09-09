import { ChainName, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { ChainKeplr } from './chain';
import { KeplrData } from './types';
import { getKeplrFromExtension } from './utils';

export class KeplrWallet extends MainWalletBase<Keplr, KeplrData, ChainKeplr> {
  protected _chains!: Map<ChainName, ChainKeplr>;

  constructor(_concurrency?: number) {
    super(_concurrency);
  }

  get client(): Promise<Keplr | undefined> {
    return (async () => {
      return await getKeplrFromExtension();
    })();
  }

  setChains(supportedChains: ChainName[]): void {
    this._chains = new Map(
      supportedChains.map((chainName) => [
        chainName,
        new ChainKeplr(chainName, this),
      ])
    );
  }

  async update() {
    this.setState(State.Pending);
    for (const chainName of this.chainNames) {
      try {
        const chainWallet = this.chains.get(chainName)!;
        // delete chainWallet.actions?.modalOpen;
        await chainWallet.update();
        this.setData({
          username: chainWallet.username!,
        });
        this.setState(State.Done);
        break;
      } catch (e) {
        console.error(`chain ${chainName}: ${(e as Error).message}`);
      }
    }
    if (!this.isReady) {
      this.setState(State.Error);
      this.setMessage(`Failed to connect keplr.`);
    }
    // this.actions?.modalOpen?.(false);
  }
}
