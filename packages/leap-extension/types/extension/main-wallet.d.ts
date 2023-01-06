import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { LeapClient } from './client';
export declare class LeapExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    fetchClient(): Promise<LeapClient>;
}
