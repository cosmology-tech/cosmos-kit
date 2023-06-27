import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class LeapExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { LeapExtensionWallet };
