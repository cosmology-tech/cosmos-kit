import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class CosmostationExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { CosmostationExtensionWallet };
