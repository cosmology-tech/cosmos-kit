/* eslint-disable @typescript-eslint/no-empty-function */
import EventEmitter from 'events';

import { COSMIFRAME_WALLET_ID } from '../cosmiframe/constants';
import {
  ChainName,
  ChainRecord,
  DappEnv,
  DisconnectOptions,
  EndpointOptions,
  IChainWallet,
  State,
  Wallet,
  WalletClient,
  WalletStatus,
} from '../types';
import type { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';

export abstract class MainWalletBase extends WalletBase {
  protected _chainWalletMap?: Map<ChainName, ChainWalletBase>;
  preferredEndpoints?: EndpointOptions['endpoints'];
  ChainWallet: IChainWallet;

  constructor(walletInfo: Wallet, ChainWallet: IChainWallet) {
    super(walletInfo);
    this.ChainWallet = ChainWallet;
    this.emitter = new EventEmitter();
    this.emitter.on('broadcast_client', (client: WalletClient) => {
      this.logger?.debug(
        `[Event Fired] \`broadcast_client\` (${this.walletName})`
      );
      this.chainWalletMap?.forEach((chainWallet) => {
        chainWallet.initClientDone(client);
      });
    });
    this.emitter.on('broadcast_env', (env: DappEnv) => {
      this.logger?.debug(
        `[Event Fired] \`broadcast_env\` (${this.walletName})`
      );
      this.chainWalletMap?.forEach((chainWallet) => {
        chainWallet.setEnv(env);
      });
    });
    this.emitter.on('sync_connect', async (chainName?: ChainName) => {
      this.logger?.debug(`[Event Fired] \`sync_connect\` (${this.walletName})`);
      await this.connectAll(true, chainName);
      this.update();
    });
    this.emitter.on('sync_disconnect', async (chainName?: ChainName) => {
      this.logger?.debug(
        `[Event Fired] \`sync_disconnect\` (${this.walletName})`
      );
      await this.disconnectAll(true, chainName);
      this.reset();
    });
    this.emitter.on('reset', (chainIds: string[]) => {
      this.logger?.debug(`[Event Fired] \`reset\` (${this.walletName})`);
      chainIds.forEach((chainId) =>
        Array.from(this.chainWalletMap.values())
          .find((cw) => cw.chainId === chainId)
          ?.reset()
      );
    });
  }

  initingClient() {
    this.clientMutable.state = State.Pending;
    this.clientMutable.message = void 0;
    this.clientMutable.data = void 0;
    this.actions?.clientState?.(State.Pending);
    this.actions?.clientMessage?.(void 0);
    this.chainWalletMap?.forEach((chainWallet) => {
      chainWallet.initingClient();
    });
  }

  initClientDone(client: WalletClient | undefined) {
    this.clientMutable.data = client;
    this.clientMutable.state = State.Done;
    this.clientMutable.message = void 0;
    this.actions?.clientState?.(State.Done);
    this.actions?.clientMessage?.(void 0);
    this.chainWalletMap?.forEach((chainWallet) => {
      chainWallet.initClientDone(client);
    });
  }

  initClientError(error: Error | undefined) {
    this.clientMutable.message = error?.message;
    this.clientMutable.state = State.Error;
    this.actions?.clientState?.(State.Error);
    this.actions?.clientMessage?.(error?.message);
    this.chainWalletMap?.forEach((chainWallet) => {
      chainWallet.initClientError(error);
    });
    if (this.throwErrors === true) {
      throw new Error(this.clientMutable.message);
    }
  }

  protected onSetChainsDone(): void { }

  private makeFinalEndpoints(chain: ChainRecord) {
    const isTestNet = chain.name.includes('testnet');
    const preferredEndpoints = {
      isLazy: chain.preferredEndpoints?.isLazy,
      rpc: [
        ...(chain.preferredEndpoints?.rpc || []),
        ...(this.preferredEndpoints?.[chain.name]?.rpc || []),
        ...(chain.chain?.apis?.rpc?.map((e) => e.address) || []),
        isTestNet
          ? `https://rpc.testcosmos.directory/${chain.name}`
          : `https://rpc.cosmos.directory/${chain.name}`,
      ],
      rest: [
        ...(chain.preferredEndpoints?.rest || []),
        ...(this.preferredEndpoints?.[chain.name]?.rest || []),
        ...(chain.chain?.apis?.rest?.map((e) => e.address) || []),
        isTestNet
          ? `https://rest.testcosmos.directory/${chain.name}`
          : `https://rest.cosmos.directory/${chain.name}`,
      ],
    };
    return preferredEndpoints;
  }

  addEnpoints(endpoints?: EndpointOptions['endpoints']) {
    this.getChainWalletList(false).forEach((wallet) => {
      wallet.addEndpoints(endpoints[wallet.chainName]);
    });
  }

  setChains(chains: ChainRecord[], overwrite = true): void {
    if (overwrite || !this._chainWalletMap) {
      this._chainWalletMap = new Map();
    }
    chains.forEach((chain) => {
      const chainWallet = new this.ChainWallet(this.walletInfo, {
        ...chain,
        preferredEndpoints: this.makeFinalEndpoints(chain),
      });

      chainWallet.mainWallet = this;
      chainWallet.emitter = this.emitter;
      chainWallet.logger = this.logger;
      chainWallet.throwErrors = this.throwErrors;
      chainWallet.session = this.session;
      chainWallet.walletConnectOptions = this.walletConnectOptions;
      chainWallet.initClient = this.initClient;

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

  getChainWalletList = (activeOnly = true) => {
    const allChainWallets = Array.from(this.chainWalletMap.values());
    return activeOnly
      ? allChainWallets.filter((w) => w.isActive)
      : allChainWallets;
  };

  getGlobalStatusAndMessage = (
    activeOnly = true
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

  async update() {
    // in case nonexist wallet is set as current wallet
    if (this.walletStatus === 'NotExist') {
      return window.localStorage.removeItem('cosmos-kit@2:core//current-wallet');
    }

    this.setData(void 0);
    this.setMessage(void 0);
    this.setState(State.Done);
    this.activate();
    if (this.walletName !== COSMIFRAME_WALLET_ID) {
      window?.localStorage.setItem(
        'cosmos-kit@2:core//current-wallet',
        this.walletName
      );
    }
  }

  reset() {
    this.setData(void 0);
    this.setMessage(void 0);
    this.setState(State.Init);
    this.inactivate();
  }

  async connectAll(activeOnly = true, exclude?: ChainName) {
    const chainWalletList = this.getChainWalletList(activeOnly);

    // Avoid duplicate connect popups in wallet mobile Apps when using useChains
    if (
      chainWalletList.length > 0 &&
      chainWalletList.every(
        (wallet) => wallet.isModeWalletConnect && wallet.connectChains
      )
    ) {
      return;
    }

    for (const w of chainWalletList) {
      if (w.chainName !== exclude) {
        await w.connect();
      }
    }
  }

  async disconnectAll(
    activeOnly = true,
    exclude?: ChainName,
    options?: DisconnectOptions
  ) {
    const chainWalletList = this.getChainWalletList(activeOnly);
    for (const w of chainWalletList) {
      if (w.chainName !== exclude) {
        await w.disconnect(false, options);
      }
    }
  }
}
