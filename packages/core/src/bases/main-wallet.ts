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
import EventEmitter from 'events';

export abstract class MainWalletBase extends WalletBase<MainWalletData> {
  protected _chainWallets?: Map<ChainName, ChainWalletBase>;
  preferredEndpoints?: EndpointOptions;
  ChainWallet: IChainWallet;

  constructor(walletInfo: Wallet, ChainWallet: IChainWallet) {
    super(walletInfo);
    this.ChainWallet = ChainWallet;
    this.emitter = new EventEmitter();
    this.emitter.on('broadcast_client', (client) => {
      this.client = client;
    });
    this.emitter.on('sync_connect', (chainName?: ChainName) => {
      this.connectActive(chainName);
    });
    this.emitter.on('sync_disconnect', (chainName?: ChainName) => {
      this.disconnectActive(chainName);
    });
  }

  protected onSetChainsDone(): void {
    this.chainWallets?.forEach((chainWallet) => {
      chainWallet.emitter = this.emitter;
      chainWallet.client = this.client;
      chainWallet.initClient = this.initClient;
      (chainWallet as any).setOptions?.((this as any).options);
    });
  }

  setChains(chains: ChainRecord[], overwrite = true): void {
    if (overwrite || !this._chainWallets) {
      this._chainWallets = new Map();
    }
    chains.forEach((chain) => {
      chain.preferredEndpoints = {
        rpc: [
          ...(chain.chain?.apis?.rpc?.map((e) => e.address) || []),
          `https://rpc.cosmos.directory/${chain.name}`,
          ...(this.preferredEndpoints?.[chain.name]?.rpc || []),
          ...(chain.preferredEndpoints?.rpc || []),
        ],
        rest: [
          ...(chain.chain?.apis?.rest?.map((e) => e.address) || []),
          `https://rest.cosmos.directory/${chain.name}`,
          ...(this.preferredEndpoints?.[chain.name]?.rest || []),
          ...(chain.preferredEndpoints?.rest || []),
        ],
      };

      const chainWallet = new this.ChainWallet(this.walletInfo, chain);
      chainWallet.logger = this.logger;

      this._chainWallets!.set(chain.name, chainWallet);
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

  connectActive(exclude?: ChainName) {
    this.chainWallets.forEach((w) => {
      if (w.isActive && !w.isWalletConnected && w.chainName !== exclude) {
        w.connect();
      }
    });
  }

  disconnectActive(exclude?: ChainName) {
    this.chainWallets.forEach((w) => {
      if (w.isActive && !w.isWalletDisconnected && w.chainName !== exclude) {
        w.disconnect();
      }
    });
  }
}
