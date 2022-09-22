import { ChainRecord, ChainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { KeplrExtensionWallet } from './main-wallet';
import { ChainKeplrExtensionData } from './types';
export declare class ChainKeplrExtension extends ChainWalletBase<Keplr, ChainKeplrExtensionData, KeplrExtensionWallet> {
    constructor(_chainRecord: ChainRecord, mainWallet: KeplrExtensionWallet);
    get client(): Keplr | Promise<Keplr>;
    get username(): string | undefined;
    update(): Promise<void>;
}
