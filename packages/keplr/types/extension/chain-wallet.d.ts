import { Callbacks, ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { ChainKeplrExtensionData } from './types';
export declare class ChainKeplrExtension extends ChainWalletBase<Keplr, ChainKeplrExtensionData> {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get username(): string | undefined;
    fetchClient(): Promise<Keplr>;
    update(callbacks?: Callbacks): Promise<void>;
}
