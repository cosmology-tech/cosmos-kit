import { ChainWallet } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import {
  DappEnv,
  ChainRecord,
  WalletName,
  ExtendedHttpEndpoint,
  NameService,
  Wallet,
  WalletClient,
  AuthRange,
  WalletStatus,
  State,
  WalletAccount,
} from './types';
import { ClientNotExistError, getGlobalStatusAndMessage } from './utils';

export class WalletRepo extends StateBase {
  readonly wallets: ChainWallet[];

  constructor(wallets: ChainWallet[] = []) {
    super();
    this.wallets = wallets;
  }
}

/**
 * Store ChainWallets for a particular Wallet.
 */
export class WalletRepoWithGivenWallet extends WalletRepo {
  walletInfo: Wallet;

  constructor(walletInfo: Wallet, wallets: ChainWallet[] = []) {
    super(wallets);
    this.walletInfo = walletInfo;
    if (wallets.findIndex((w) => w.walletName !== this.walletName) > -1) {
      throw new Error('Wallets not matched with given wallet.');
    }
    this.setActions(this.wallets[0]?.actions);
  }

  get walletName() {
    return this.walletInfo.name;
  }

  get client(): WalletClient | undefined {
    return this.wallets[0]?.client;
  }

  get authRange(): AuthRange {
    const authRange: AuthRange = {};
    this.wallets.forEach((w) => {
      authRange[w.namespace] = {
        chainIds: [...(authRange[w.namespace]?.chainIds || []), ...w.chainId],
      };
    });
    return authRange;
  }

  setMutable(state: State, data?: WalletAccount[], message?: string) {
    if (data && data.length > 0) {
      this.wallets.forEach((w) => {
        const account = data.find(
          (d) => w.namespace == d.namespace && w.chainId == d.chainId
        );
        w.setMutableWithoutActions(State.Done, account);
      });
    }
    this.setData(data);
    this.setState(state);
    this.setMessage(message);
  }

  async connectAll() {
    if (!this.client) {
      this.setMutable(State.Error, void 0, ClientNotExistError.message);
      return;
    }

    this.setMutable(State.Pending);
    try {
      await this.client.connect(this.authRange);
      const accounts = await this.client.getAccounts(this.authRange);
      this.setMutable(State.Done, accounts);
    } catch (error) {
      this.setMutable(
        State.Error,
        void 0,
        `MultiChain Error: ${(error as Error).message}`
      );
    }
  }

  async disconnectAll() {
    try {
      await this.client.disconnect(this.authRange);
      this.setMutable(State.Init);
    } catch (error) {
      this.setMutable(
        State.Error,
        void 0,
        `MultiChain Error: ${(error as Error).message}`
      );
    }
  }
}

/**
 * Store ChainWallets for a particular Chain.
 */
export class WalletRepoWithGivenChain extends WalletRepo {
  isActive = false;
  chainRecord: ChainRecord;
  namespace = 'cosmos';
  repelWallet: boolean = true;

  constructor(chainRecord: ChainRecord, wallets: ChainWallet[] = []) {
    super(wallets);
    this.chainRecord = chainRecord;
    if (wallets.findIndex((w) => w.chainName !== this.chainName) > -1) {
      throw new Error('Wallets not matched with given chain.');
    }

    if (this.repelWallet) {
      this.wallets.forEach((w) => {
        w.updateCallbacks({
          ...w.callbacks,
          beforeConnect: async () => {
            this.wallets.forEach(async (w2) => {
              if (!w2.isWalletDisconnected && w2 !== w) {
                await w2.disconnect();
              }
            });
          },
        });
      });
    }
  }

  setEnv(env?: DappEnv): void {
    this._env = env;
    this.wallets.forEach((w) => w.setEnv(env));
  }

  activate() {
    this.isActive = true;
    this.wallets.forEach((w) => w.activate());
  }

  get chainName() {
    return this.chainRecord.name;
  }

  get chainLogo(): string | undefined {
    return (
      // until chain_registry fix this
      // this.chainInfo.chain.logo_URIs?.svg ||
      // this.chainInfo.chain.logo_URIs?.png ||
      // this.chainInfo.chain.logo_URIs?.jpeg ||
      this.chainRecord.assetList?.assets[0]?.logo_URIs?.svg ||
      this.chainRecord.assetList?.assets[0]?.logo_URIs?.png ||
      undefined
    );
  }

  get isSingleWallet() {
    return this.wallets.length === 1;
  }

  get current(): ChainWallet | undefined {
    if (!this.repelWallet) {
      this.logger.warn(
        'when `repelWallet` is set false, `current` is always undefined.'
      );
      return void 0;
    }
    return this.wallets.find((w) => !w.isWalletDisconnected);
  }

  getWallet = (walletName: WalletName): ChainWallet | undefined => {
    return this.wallets.find((w) => w.walletName === walletName);
  };

  openView = () => {
    this.actions?.viewWalletRepos?.(this);
    this.actions?.viewOpen?.(true);
  };

  closeView = () => {
    this.actions?.viewOpen?.(false);
  };

  connect = async (walletName?: WalletName) => {
    if (walletName) {
      const wallet = this.getWallet(walletName);
      await wallet?.connect();
    } else {
      this.openView();
    }
  };

  disconnect = async (walletName?: WalletName) => {
    if (walletName) {
      await this.getWallet(walletName)?.disconnect();
    } else {
      await this.current.disconnect();
    }
  };

  getRpcEndpoint = async (
    isLazy?: boolean
  ): Promise<string | ExtendedHttpEndpoint> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getRpcEndpoint(isLazy);
      } catch (error) {
        this.logger?.debug(
          `${(error as Error).name}: ${(error as Error).message}`
        );
      }
    }
    return Promise.reject(`No valid RPC endpoint for chain ${this.chainName}!`);
  };

  getRestEndpoint = async (
    isLazy?: boolean
  ): Promise<string | ExtendedHttpEndpoint> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getRestEndpoint(isLazy);
      } catch (error) {
        this.logger?.debug(
          `${(error as Error).name}: ${(error as Error).message}`
        );
      }
    }
    return Promise.reject(
      `No valid REST endpoint for chain ${this.chainName}!`
    );
  };

  getNameService = async (): Promise<NameService> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getNameService();
      } catch (error) {
        this.logger?.debug(
          `${(error as Error).name}: ${(error as Error).message}`
        );
      }
    }
    return Promise.reject(
      `Something wrong! Probably no valid RPC endpoint or name service is not registered for chain ${this.chainName}.`
    );
  };
}
