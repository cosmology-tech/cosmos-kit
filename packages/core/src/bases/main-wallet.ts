import {
  Callbacks,
  ChainName,
  ChainRecord,
  EndpointOptions,
  IChainWallet,
  SessionOptions,
  State,
  Wallet,
  WalletClient,
} from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
import EventEmitter from 'events';

export abstract class MainWalletBase extends WalletBase {
  protected _chainWallets?: Map<ChainName, ChainWalletBase>;
  preferredEndpoints?: EndpointOptions;
  ChainWallet: IChainWallet;

  constructor(walletInfo: Wallet, ChainWallet: IChainWallet) {
    super(walletInfo);
    this.ChainWallet = ChainWallet;
    this.emitter = new EventEmitter();
    this.emitter.on('broadcast_client', (client: WalletClient) => {
      this.chainWallets?.forEach((chainWallet) => {
        chainWallet.initClientDone(client);
      });
    });
    this.emitter.on('sync_connect', (chainName?: ChainName) => {
      this.connectActive(chainName);
    });
    this.emitter.on('sync_disconnect', (chainName?: ChainName) => {
      this.disconnectActive(chainName);
    });
    this.emitter.on('reset', (chainIds: string[]) => {
      chainIds.forEach((chainId) =>
        Array.from(this.chainWallets.values())
          .find((cw) => cw.chainId === chainId)
          ?.reset()
      );
    });
  }

  protected onSetChainsDone(): void {}

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

      chainWallet.emitter = this.emitter;
      chainWallet.logger = this.logger;
      chainWallet.session = this.session;
      chainWallet.walletConnectOptions = this.walletConnectOptions;
      chainWallet.initClient = this.initClient;

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
    this.setMessage(void 0);

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

  async connectActive(exclude?: ChainName) {
    for (const [, w] of this.chainWallets) {
      if (w.isActive && w.chainName !== exclude) {
        await w.connect();
      }
    }
  }

  disconnectActive(exclude?: ChainName) {
    this.chainWallets.forEach((w) => {
      if (w.isActive && w.chainName !== exclude) {
        w.disconnect();
      }
    });
  }
}
