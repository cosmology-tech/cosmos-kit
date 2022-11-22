import { ChainWalletBase } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import { ChainName, Data, SessionOptions, WalletName } from './types';

export class WalletRepo extends StateBase<Data> {
  protected _wallets: ChainWalletBase[];
  options = {
    disconnectAllAtOnce: true,
    connectAllAtOnce: false,
    autoSelectWithSingleWallet: true,
  };

  constructor(wallets: ChainWalletBase[]) {
    super();
    if (wallets.length === 0) {
      throw Error('At least one wallet is required.');
    }
    this._wallets = wallets;
  }

  get wallets() {
    return this._wallets;
  }

  get isSingleWallet() {
    return this.wallets.length === 1;
  }

  getWallet = (
    chainName: ChainName,
    walletName: WalletName
  ): ChainWalletBase | undefined => {
    return this.wallets.find(
      (w) => w.chainName === chainName && w.walletName === walletName
    );
  };

  openView = () => {
    this.actions?.viewWallets(this.wallets);
    this.actions?.viewOpen(true);
  };

  async connect(sessionOptions?: SessionOptions) {
    if (this.options.connectAllAtOnce) {
      this.wallets.forEach(async (w) => {
        await w.connect(sessionOptions);
      });
    } else if (this.options.autoSelectWithSingleWallet && this.isSingleWallet) {
      await this.wallets[0].connect(sessionOptions);
    } else {
      this.openView();
    }
  }

  async disconnect() {
    if (this.options.disconnectAllAtOnce) {
      this.wallets.forEach(async (w) => {
        await w.disconnect();
      });
    } else if (this.options.autoSelectWithSingleWallet && this.isSingleWallet) {
      await this.wallets[0].disconnect();
    } else {
      this.openView();
    }
  }
}
