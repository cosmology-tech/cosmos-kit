import {
  ChainName,
  ChainRecord,
  DappEnv,
  EndpointOptions,
  IChainWallet,
  Wallet,
  WalletClient,
  WalletStatus,
} from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
import EventEmitter from 'events';

export abstract class MainWalletBase extends WalletBase {
  protected _chainWalletMap?: Map<ChainName, ChainWalletBase>;
  preferredEndpoints?: EndpointOptions['endpoints'];
  ChainWallet: IChainWallet;

  constructor(walletInfo: Wallet, ChainWallet: IChainWallet) {
    super(walletInfo);
    this.ChainWallet = ChainWallet;
    this.emitter = new EventEmitter();
    this.emitter.on('broadcast_client', (client: WalletClient) => {
      this.chainWalletMap?.forEach((chainWallet) => {
        chainWallet.initClientDone(client);
      });
    });
    this.emitter.on('broadcast_env', (env: DappEnv) => {
      this.chainWalletMap?.forEach((chainWallet) => {
        chainWallet.setEnv(env);
      });
    });
    this.emitter.on('sync_connect', (chainName?: ChainName) => {
      this.connectAll(true, chainName);
      this.activate();
    });
    this.emitter.on('sync_disconnect', (chainName?: ChainName) => {
      this.disconnectAll(true, chainName);
      this.inactivate();
    });
    this.emitter.on('reset', (chainIds: string[]) => {
      chainIds.forEach((chainId) =>
        Array.from(this.chainWalletMap.values())
          .find((cw) => cw.chainId === chainId)
          ?.reset()
      );
    });
  }

  protected onSetChainsDone(): void {}

  setChains(chains: ChainRecord[], overwrite = true): void {
    if (overwrite || !this._chainWalletMap) {
      this._chainWalletMap = new Map();
    }
    chains.forEach((chain) => {
      chain.preferredEndpoints = {
        ...chain.preferredEndpoints,
        rpc: [
          ...(chain.preferredEndpoints?.rpc || []),
          ...(this.preferredEndpoints?.[chain.name]?.rpc || []),
          ...(chain.chain?.apis?.rpc?.map((e) => e.address) || []),
          `https://rpc.cosmos.directory/${chain.name}`,
        ],
        rest: [
          ...(chain.preferredEndpoints?.rest || []),
          ...(this.preferredEndpoints?.[chain.name]?.rest || []),
          ...(chain.chain?.apis?.rest?.map((e) => e.address) || []),
          `https://rest.cosmos.directory/${chain.name}`,
        ],
      };

      const chainWallet = new this.ChainWallet(this.walletInfo, chain);

      chainWallet.emitter = this.emitter;
      chainWallet.logger = this.logger;
      chainWallet.session = this.session;
      chainWallet.walletConnectOptions = this.walletConnectOptions;
      chainWallet.initClient = this.initClient;
      chainWallet.isLazy = chain.preferredEndpoints?.isLazy;

      this._chainWalletMap!.set(chain.name, chainWallet);
    });

    this.onSetChainsDone();
  }

  get chainWalletMap() {
    return this._chainWalletMap;
  }

  getChainWallet = (chainName: string): ChainWalletBase | undefined => {
    return this.chainWalletMap?.get(chainName);
  };

  getChainWalletList = (activeOnly: boolean = true) => {
    const allChainWallets = Array.from(this.chainWalletMap.values());
    return activeOnly
      ? allChainWallets.filter((w) => w.isActive)
      : allChainWallets;
  };

  getGlobalStatusAndMessage = (
    activeOnly: boolean = true
  ): [WalletStatus, string | undefined] => {
    const chainWalletList = this.getChainWalletList(activeOnly);

    let wallet = chainWalletList.find((w) => w.isWalletNotExist);
    if (wallet) return [wallet.walletStatus, wallet.message];

    wallet = chainWalletList.find((w) => w.isWalletConnecting);
    if (wallet) return [WalletStatus.Connecting, void 0];

    wallet = chainWalletList.find((w) => w.isWalletDisconnected);
    if (wallet) {
      return [WalletStatus.Disconnected, 'Exist disconnected wallets'];
    }

    wallet = chainWalletList.find((w) => w.isError || w.isWalletRejected);
    if (wallet) return [wallet.walletStatus, wallet.message];

    return [WalletStatus.Connected, void 0];
  };

  async update() {}

  async connectAll(activeOnly: boolean = true, exclude?: ChainName) {
    const chainWalletList = this.getChainWalletList(activeOnly);
    for (const w of chainWalletList) {
      if (w.chainName !== exclude) {
        await w.connect();
      }
    }
  }

  async disconnectAll(activeOnly: boolean = true, exclude?: ChainName) {
    const chainWalletList = this.getChainWalletList(activeOnly);
    for (const w of chainWalletList) {
      if (w.chainName !== exclude) {
        await w.disconnect();
      }
    }
  }
}
