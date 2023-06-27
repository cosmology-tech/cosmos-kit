import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class Web3AuthWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { Web3AuthWallet };
