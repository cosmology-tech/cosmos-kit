import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { TrustClient } from './client';
export declare class TrustExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    fetchClient(): Promise<TrustClient>;
}
