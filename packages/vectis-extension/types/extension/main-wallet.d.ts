import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { VectisClient } from './client';
export declare class VectisExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    fetchClient(): Promise<VectisClient>;
}
