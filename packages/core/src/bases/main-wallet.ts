import { ChainName, ChainRecord, State } from '../types';
import { MainWalletDataBase, ChainWalletDataBase } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { StateBase } from './state';

export abstract class MainWalletBase<
  WalletClient,
  MainWalletData extends MainWalletDataBase,
  ChainWalletData extends ChainWalletDataBase,
  ChainWallet extends ChainWalletBase<WalletClient, ChainWalletData, unknown>
> extends StateBase<MainWalletData> {
  protected abstract _chains: Map<ChainName, ChainWallet>;
  protected abstract _client: Promise<WalletClient | undefined> | WalletClient | undefined;
  // protected queue: PQueue;

  protected _supportedChains: ChainRecord[] = [];
  protected _concurrency: number;

  constructor(_concurrency?: number) {
    super();
    this._concurrency = _concurrency || 1;
    // this.queue = new PQueue({ concurrency: this._concurrency });
    this.setChains(this._supportedChains);
  }

  get client() {
    return this._client;
  }

  setSupportedChains(chains: ChainRecord[]) {
    this._supportedChains = chains;
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

  get chainList(): ChainWallet[] {
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
    this.reset();
  }

  async connect() {
    if (!await this.client) {
      this.setState(State.Error);
      this.setMessage("Client Not Exist!");
      return
    }
    await this.update();
  }

  protected abstract setChains(supportedChains?: ChainRecord[]): void;
}
