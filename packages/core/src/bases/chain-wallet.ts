import { ChainRegistry, ChainWalletData } from '../types';
import { WalletCommonBase } from './wallet-common';

export abstract class ChainWalletBase<
  C,
  T extends ChainWalletData,
  MainWallet
> extends WalletCommonBase<C, T> {
  protected _chainRegistry: ChainRegistry;
  protected mainWallet?: MainWallet;

  constructor(_chainRegistry: ChainRegistry, mainWallet?: MainWallet) {
    super();
    this._chainRegistry = _chainRegistry;
    this.mainWallet = mainWallet;
  }

  get chainRegistry() {
    return this._chainRegistry;
  }

  get chainName() {
    return this.chainRegistry.name;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  disconnect() {
    this.clear();
  }
}
