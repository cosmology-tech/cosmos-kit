import {
  Callbacks,
  ChainName,
  ChainRecord,
  EndpointOptions,
  IChainWallet,
  MainWalletData,
  SessionOptions,
  State,
  Wallet,
} from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';

export abstract class MainWalletBase extends WalletBase<MainWalletData> {
  protected _chainWallets?: Map<ChainName, ChainWalletBase>;
  preferredEndpoints?: EndpointOptions;
  ChainWallet: IChainWallet;

  constructor(walletInfo: Wallet, ChainWallet: IChainWallet) {
    super(walletInfo);
    this.ChainWallet = ChainWallet;
    this.clientPromise = this.fetchClient();
  }

  protected onSetChainsDone(): void {
    this.chainWallets?.forEach((chainWallet) => {
      chainWallet.client = this.client;
      chainWallet.clientPromise = this.clientPromise;
      chainWallet.fetchClient = this.fetchClient;
    });
  }

  setChains(chains: ChainRecord[], overwrite = true): void {
    if (overwrite || !this._chainWallets) {
      this._chainWallets = new Map();
    }
    chains.forEach((chain) => {
      chain.preferredEndpoints = {
        rpc: [
          ...(chain.preferredEndpoints?.rpc || []),
          ...(this.preferredEndpoints?.[chain.name]?.rpc || []),
          `https://rpc.cosmos.directory/${chain.name}`,
          ...(chain.chain?.apis?.rpc?.map((e) => e.address) || []),
        ],
        rest: [
          ...(chain.preferredEndpoints?.rest || []),
          ...(this.preferredEndpoints?.[chain.name]?.rest || []),
          `https://rest.cosmos.directory/${chain.name}`,
          ...(chain.chain?.apis?.rest?.map((e) => e.address) || []),
        ],
      };

      this._chainWallets!.set(
        chain.name,
        new this.ChainWallet(this.walletInfo, chain)
      );
    });

    this.onSetChainsDone();
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get chainWallets() {
    return this._chainWallets;
  }

  getChainWallet = (chainName: string): ChainWalletBase | undefined => {
    return this.chainWallets?.get(chainName);
  };

  async update(sessionOptions?: SessionOptions, callbacks?: Callbacks) {
    await (callbacks || this.callbacks)?.beforeConnect?.();

    if (!this.client) {
      this.setClientNotExist();
      return;
    }
    this.setState(State.Done);

    if (sessionOptions?.duration) {
      setTimeout(() => {
        this.disconnect(callbacks);
      }, sessionOptions?.duration);
    }

    await (callbacks || this.callbacks)?.afterConnect?.();
  }

  reset(): void {
    this.chainWallets?.forEach((chain) => {
      chain.reset();
    });
    this.setData(undefined);
    this.setMessage(undefined);
    this.setState(State.Init);
  }
}
