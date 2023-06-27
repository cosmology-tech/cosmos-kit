import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class TrustExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { TrustExtensionWallet };
