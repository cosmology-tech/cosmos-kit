import { ChainRegistry, ChainWalletData } from '../types';
import { WalletCommonBase } from './wallet-common';

export abstract class ChainWalletBase<
  A,
  B extends ChainWalletData,
  C
> extends WalletCommonBase<A, B> {
  protected _chainRegistry: ChainRegistry;
  protected mainWallet?: C;

  constructor(_chainRegistry: ChainRegistry, mainWallet?: C) {
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
