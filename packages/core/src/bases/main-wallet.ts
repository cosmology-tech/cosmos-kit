/* eslint-disable @typescript-eslint/no-explicit-any */
import { Callbacks, ChainName, ChainRecord, Wallet } from '../types';
import { MainWalletDataBase } from '../types';
import { WalletBase } from './wallet';

export abstract class MainWalletBase<
  Client,
  Data extends MainWalletDataBase,
  ChainWallet extends {
    disconnect: () => void;
  }
> extends WalletBase<Client, Data> {
  protected _chainWallets: Map<ChainName, ChainWallet>;
  protected _walletInfo: Wallet;

  constructor(walletInfo: Wallet, chains: ChainRecord[] = []) {
    super();
    this._walletInfo = walletInfo;
    if (chains) {
      this.setChains(chains);
    }
  }

  get walletInfo(): Wallet {
    return this._walletInfo;
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
