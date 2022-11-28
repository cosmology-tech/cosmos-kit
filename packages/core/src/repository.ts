/* eslint-disable no-console */
import { ChainWalletBase } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import {
  ChainName,
  ChainRecord,
  Data,
  SessionOptions,
  WalletName,
} from './types';

/**
 * Store all ChainWallets for a particular Chain.
 */
export class WalletRepo extends StateBase<Data> {
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
        w.callbacks = {
          beforeConnect: () => {
            this.wallets.forEach(async (w2) => {
              if (!w2.isWalletDisconnected && w2 !== w) {
                await w2.disconnect();
              }
            });
          },
        };
      });
    }
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
    this.actions?.viewWalletRepo(this);
    this.actions?.viewOpen(true);
  };

  connect = async (walletName?: WalletName) => {
    if (walletName) {
      await this.getWallet(walletName).connect(this.sessionOptions);
    } else if (this.isSingleWallet) {
      await this.wallets[0].connect(this.sessionOptions);
    } else {
      this.openView();
    }
  };

  disconnect = async (walletName?: WalletName) => {
    if (walletName) {
      await this.getWallet(walletName).disconnect();
    } else if (this.isSingleWallet) {
      await this.wallets[0].disconnect();
    } else if (this.options.mutexWallet) {
      await this.current?.disconnect();
    } else {
      this.openView();
    }
  };
}
