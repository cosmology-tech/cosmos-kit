import { MainWalletBase, Wallet } from '@cosmos-kit/core';

declare class XDEFIExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet);
    initClient(): Promise<void>;
}

export { XDEFIExtensionWallet };
