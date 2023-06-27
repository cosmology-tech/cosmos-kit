import { MainWalletBase, Wallet, EndpointOptions } from '@cosmos-kit/core';

declare class Coin98ExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
    initClient(): Promise<void>;
}

export { Coin98ExtensionWallet };
