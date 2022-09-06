import { ChainName } from '../types';
import { WalletData } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletCommonBase } from './wallet-common';

export abstract class MainWalletBase<
  C,
  D extends WalletData,
  T extends ChainWalletBase<any, any>
> extends WalletCommonBase<D> {
  protected abstract _chains: Map<ChainName, T>;
  // protected queue: PQueue;

  protected _supportedChains: ChainName[] = [];
  protected _concurrency: number;

  constructor(_concurrency?: number) {
    super();
    this._concurrency = _concurrency || 1;
    // this.queue = new PQueue({ concurrency: this._concurrency });
    this.setChains(this._supportedChains);
  }

  setSupportedChains(chainNames: ChainName[]) {
    this._supportedChains = chainNames;
    this.setChains(this._supportedChains);
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get supportedChains() {
    return this._supportedChains;
  }

  get concurrency() {
    return this._concurrency;
  }

  get chains() {
    return this._chains;
  }

  get count() {
    return this.chains.size;
  }

  get chainNames(): ChainName[] {
    return Array.from(this.chains.keys());
  }

  get chainList(): T[] {
    return Array.from(this.chains.values());
  }

  getChain(chainName: string) {
    if (!this.chains.has(chainName)) {
      throw new Error(`Unknown chain name: ${chainName}`);
    }
    return this.chains.get(chainName)!;
  }

  // async updateAllChains() {
  //     console.info('Running all chain wallet update');
  //     await Promise.all([...this.chains].map(([chainName, chain]) => {
  //         const request = async () => {
  //             await chain.update();
  //         };
  //         return this.queue.add(request, { nameentifier: chainName } as any);
  //     }));
  //     console.info('All chain wallet update complete')
  // }

  disconnect() {
    this.chains.forEach((chain) => {
      chain.disconnect();
    });
    this.clear();
  }

  abstract get client(): Promise<C | undefined> | C | undefined;

  abstract setChains(supportedChains?: ChainName[]): void;
}
