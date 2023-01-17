import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { XDEFIClient } from './client';
export declare class XDEFIExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet);
  fetchClient(): Promise<XDEFIClient>;
}
