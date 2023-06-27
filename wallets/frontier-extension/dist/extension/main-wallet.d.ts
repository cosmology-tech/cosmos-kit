import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class FrontierExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { FrontierExtensionWallet };
