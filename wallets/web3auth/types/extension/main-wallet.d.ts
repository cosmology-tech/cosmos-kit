import { MainWalletBase, Wallet } from '@cosmos-kit/core';
export declare class Web3AuthWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}
