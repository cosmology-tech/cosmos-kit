import { MainWalletBase, Wallet, EndpointOptions } from '@cosmos-kit/core';

declare class ExodusExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
    initClient(): Promise<void>;
}

export { ExodusExtensionWallet };
