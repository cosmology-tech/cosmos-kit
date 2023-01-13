/* eslint-disable no-empty */
/* eslint-disable no-console */
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';

import { ChainWalletBase } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import { NameService } from './name-service';
import { AppEnv, ChainRecord, Data, SessionOptions, WalletName } from './types';

/**
 * Store all ChainWallets for a particular Chain.
 */
export class WalletRepo extends StateBase<Data> {
  isInUse = false;
  chainRecord: ChainRecord;
  private _wallets: ChainWalletBase[];
  options = {
    mutexWallet: true, // only allow one wallet type to connect one time
  };
  sessionOptions?: SessionOptions;

  constructor(
    chainRecord: ChainRecord,
    wallets: ChainWalletBase[] = [],
    sessionOptions?: SessionOptions
  ) {
    super();
    this.chainRecord = chainRecord;
    this.sessionOptions = sessionOptions;
    this._wallets = wallets;

    if (this.options.mutexWallet) {
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

  setEnv(env?: AppEnv): void {
    this._env = env;
    this.wallets.forEach((w) => w.setEnv(env));
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

  get wallets(): ChainWalletBase[] {
    if (this.isMobile) {
      return this._wallets.filter(
        (wallet) => !wallet.walletInfo.mobileDisabled
      );
    }
    return this._wallets;
  }

  get isSingleWallet() {
    return this.wallets.length === 1;
  }

  // you should never use current when `uniqueWallet` is set false
  get current(): ChainWalletBase | undefined {
    if (!this.options.mutexWallet) {
      console.warn(
        "It's meaningless to use current when `uniqueWallet` is set false."
      );
      return void 0;
    }
    return this.wallets.find((w) => !w.isWalletDisconnected);
  }

  getWallet = (walletName: WalletName): ChainWalletBase | undefined => {
    return this.wallets.find((w) => w.walletName === walletName);
  };

  openView = () => {
    this.actions?.viewWalletRepo?.(this);
    this.actions?.viewOpen?.(true);
  };

  closeView = () => {
    this.actions?.viewOpen?.(false);
  };

  connect = async (walletName?: WalletName) => {
    if (walletName) {
      const wallet = this.getWallet(walletName);
      await wallet?.connect(this.sessionOptions);
    } else if (this.isSingleWallet) {
      const wallet = this.wallets[0];
      await wallet?.connect(this.sessionOptions);
    } else {
      this.openView();
    }
  };

  disconnect = async (walletName?: WalletName) => {
    if (walletName) {
      await this.getWallet(walletName)?.disconnect();
    } else {
      for (const w of this.wallets) {
        await w.disconnect();
      }
    }
  };

  getRpcEndpoint = async (): Promise<string> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getRpcEndpoint();
      } catch (error) {}
    }
    throw new Error(`No valid RPC endpoint for chain ${this.chainName}!`);
  };

  getRestEndpoint = async (): Promise<string> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getRestEndpoint();
      } catch (error) {}
    }
    throw new Error(`No valid REST endpoint for chain ${this.chainName}!`);
  };

  getStargateClient = async (): Promise<StargateClient> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getStargateClient();
      } catch (error) {}
    }
    throw new Error(
      `Something wrong! Probably no valid RPC endpoint for chain ${this.chainName}.`
    );
  };

  getCosmWasmClient = async (): Promise<CosmWasmClient> => {
    for (const wallet of this.wallets) {
      const client = await wallet.getCosmWasmClient();
      if (client) {
        return client;
      }
    }
    throw new Error(
      `Something wrong! Probably no valid RPC endpoint for chain ${this.chainName}.`
    );
  };

  getNameService = async (): Promise<NameService> => {
    for (const wallet of this.wallets) {
      const service = await wallet.getNameService();
      if (service) {
        return service;
      }
    }
    throw new Error(
      `Something wrong! Probably no valid RPC endpoint or name service is not registered for chain ${this.chainName}.`
    );
  };
}
