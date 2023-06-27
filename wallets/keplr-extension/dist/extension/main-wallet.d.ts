import { MainWalletBase, Wallet, EndpointOptions } from '@cosmos-kit/core';

declare class KeplrExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
    initClient(): Promise<void>;
}

export { KeplrExtensionWallet };
