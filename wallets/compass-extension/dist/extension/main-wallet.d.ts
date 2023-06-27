import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class CompassExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { CompassExtensionWallet };
