import { ChainWalletBase } from './chain-wallet';
import { StateBase } from './state';

export class WalletRepoBase extends StateBase {
  readonly wallets: ChainWalletBase[];

  constructor(wallets: ChainWalletBase[] = []) {
    super();
    this.wallets = wallets;
  }
}
