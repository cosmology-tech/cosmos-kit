import { OfflineSigner } from '@cosmjs/proto-signing';
import {
  ChainRecord,
  ChainWalletBase,
  MainWalletBase,
  SimpleAccount,
  Wallet,
  WalletAccount,
  WalletClient,
} from '@cosmos-kit/core';
import { TailwindWallet } from '@tailwindzone/connect';

import { getWalletFromWindow } from '..';

/**
 * Keplr and leap both leave this interface empty.
 * Used in TailwindExtensionWallet's instantiation.
 */
export class ChainTailwindExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}

export class TailwindClient implements WalletClient {
  constructor(private tailwind: TailwindWallet) {
    this.tailwind = tailwind;
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const signer = await this.tailwind.getOfflineSigner(chainId);
    const [acc] = await signer.getAccounts();
    return {
      algo: acc.algo,
      address: acc.address,
      pubkey: acc.pubkey,
    };
  }

  async getSimpleAccount(chainId: string): Promise<SimpleAccount> {
    const signer = await this.tailwind.getOfflineSigner(chainId);
    const [acc] = await signer.getAccounts();
    return {
      chainId,
      namespace: 'tailwind-wallet',
      address: acc.address,
    };
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    return this.tailwind.getOfflineSigner(chainId);
  }
}

export class TailwindExtensionWallet extends MainWalletBase {
  constructor(wallet_info: Wallet) {
    super(wallet_info, ChainTailwindExtension);
  }

  async initClient(): Promise<void> {
    this.initingClient();
    try {
      const tailwind = await getWalletFromWindow();
      this.initClientDone(tailwind ? new TailwindClient(tailwind) : undefined);
    } catch (err) {
      this.initClientError(err as Error);
    }
  }
}
