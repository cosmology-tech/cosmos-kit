import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class VectisExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { VectisExtensionWallet };
