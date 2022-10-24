/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Callbacks,
  ChainName,
  ChainRecord,
  MainWalletDataBase,
  Wallet,
} from '../types';
import {} from '../types';
import { WalletBase } from './wallet';

export abstract class MainWalletBase<
  Client,
  Data extends MainWalletDataBase,
  ChainWallet extends {
    disconnect: () => void;
  }
> extends WalletBase<Client, Data> {
  protected _chainWallets: Map<ChainName, ChainWallet>;

  constructor(walletInfo: Wallet, chains: ChainRecord[] = []) {
    super(walletInfo);
    if (chains) {
      this.setChains(chains);
    }
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get chainWallets() {
    return this._chainWallets;
  }

  getChainWallet(chainName: string): ChainWallet {
    if (!this.chainWallets.has(chainName)) {
      throw new Error(`Unknown chain name: ${chainName}`);
    } else {
      return this.chainWallets.get(chainName);
    }
  }

  disconnect(callbacks?: Callbacks) {
    this.chainWallets.forEach((chain) => {
      chain.disconnect();
    });
    this.reset();
    callbacks?.disconnect?.();
  }

  abstract setChains(chains?: ChainRecord[]): void;
}
