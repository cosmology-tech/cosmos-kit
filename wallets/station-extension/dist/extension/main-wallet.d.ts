import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class StationExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { StationExtensionWallet };
