import { ChainName, ChainWalletData } from '../types';
import { WalletCommonBase } from './wallet-common';

export abstract class ChainWalletBase<
  T extends ChainWalletData,
  MainWallet
> extends WalletCommonBase<T> {
  protected _chainName: ChainName;
  protected mainWallet?: MainWallet;

  constructor(_chainName: ChainName, mainWallet?: MainWallet) {
    super();
    this._chainName = _chainName;
    this.mainWallet = mainWallet;
  }

  get chainName() {
    return this._chainName;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  disconnect() {
    this.clear();
  }
}
