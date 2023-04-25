import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
export declare class Coin98ExtensionWallet extends MainWalletBase {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
    initClient(): Promise<void>;
}
