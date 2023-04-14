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
import { ChainWallet } from './chain-wallet';
import { WalletBase } from './wallet';
import EventEmitter from 'events';
import { getGlobalStatusAndMessage } from '../utils';

export abstract class MainWallet extends WalletBase {
  protected _chainWalletMap?: Map<ChainName, ChainWallet>;
  preferredEndpoints?: EndpointOptions['endpoints'];
  ChainWallet: IChainWallet;
  isCurrent = false;

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

  getChainWallet = (chainName: string): ChainWallet | undefined => {
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
    return getGlobalStatusAndMessage(chainWalletList);
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
