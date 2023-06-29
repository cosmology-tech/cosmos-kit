import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
export declare class ShellExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
    initClient(): Promise<void>;
}
