import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { CosmostationClient } from './client';
export declare class CosmostationExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    fetchClient(): Promise<CosmostationClient>;
}
