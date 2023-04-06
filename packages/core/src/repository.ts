import { ChainWallet } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import {
  DappEnv,
  ChainRecord,
  WalletName,
  ExtendedHttpEndpoint,
  NameService,
} from './types';
import { Session } from './utils';

/**
 * Store all ChainWallets for a particular Chain.
 */
export class WalletRepo extends StateBase {
  isActive = false;
  chainRecord: ChainRecord;
  protected _wallets: ChainWallet[];
  namespace = 'cosmos';
  session: Session;
  repelWallet: boolean = true;

  constructor(chainRecord: ChainRecord, wallets: ChainWallet[] = []) {
    super();
    this.chainRecord = chainRecord;
    this._wallets = wallets;

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

  get wallets(): ChainWallet[] {
    return this._wallets;
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
    this.actions?.viewWalletRepo?.(this);
    this.actions?.viewOpen?.(true);
  };

  closeView = () => {
    this.actions?.viewOpen?.(false);
  };

  connect = async (walletName?: WalletName, sync?: boolean) => {
    if (walletName) {
      const wallet = this.getWallet(walletName);
      await wallet?.connect(sync);
    } else {
      this.openView();
    }
  };

  disconnect = async (walletName?: WalletName, sync?: boolean) => {
    if (walletName) {
      await this.getWallet(walletName)?.disconnect(sync);
    } else {
      await this.current.disconnect(sync);
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
