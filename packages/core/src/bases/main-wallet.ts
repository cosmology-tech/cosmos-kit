/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainInfo, ChainName, SessionOptions, State, Wallet } from '../types';
import { ChainWalletDataBase, MainWalletDataBase } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { StateBase } from './state';

export abstract class MainWalletBase<
  WalletClient,
  MainWalletData extends MainWalletDataBase,
  ChainWalletData extends ChainWalletDataBase,
  ChainWallet extends ChainWalletBase<WalletClient, ChainWalletData, any>
> extends StateBase<MainWalletData> {
  protected abstract _chains: Map<ChainName, ChainWallet>;
  protected abstract _client:
    | Promise<WalletClient | undefined>
    | WalletClient
    | undefined;

  protected _chainsInfo: ChainInfo[] = [];
  protected _walletInfo: Wallet;

  constructor(_walletInfo: Wallet, _chainsInfo?: ChainInfo[]) {
    super();
    this._walletInfo = _walletInfo;
    this._chainsInfo = _chainsInfo;
    if (_chainsInfo) {
      this.setChains(_chainsInfo);
    }
  }

  get client() {
    return this._client;
  }

  get walletInfo(): Wallet {
    return this._walletInfo;
  }

  get name() {
    return this.walletInfo.name;
  }

  get username(): string | undefined {
    return this.data?.username;
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

  getChain(chainName: string): ChainWallet {
    if (!this.chains.has(chainName)) {
      throw new Error(`Unknown chain name: ${chainName}`);
    }
    return this.chains.get(chainName);
  }

  disconnect() {
    this.chains.forEach((chain) => {
      chain.disconnect();
    });
    this.reset();
  }

  async connect(sessionOptions?: SessionOptions) {
    if (!(await this.client)) {
      this.setState(State.Error);
      this.setMessage('Client Not Exist!');
      return;
    }
    await this.update();

    if (sessionOptions?.duration) {
      setTimeout(() => {
        this.disconnect();
      }, sessionOptions?.duration);
    }
  }

  abstract setChains(supportedChains?: ChainInfo[]): void;
}
