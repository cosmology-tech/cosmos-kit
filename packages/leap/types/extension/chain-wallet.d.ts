import { Callbacks, ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import { ChainLeapExtensionData, Leap } from './types';
export declare class ChainLeapExtension extends ChainWalletBase<Leap, ChainLeapExtensionData> {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get username(): string | undefined;
    fetchClient(): Promise<Leap>;
    update(callbacks?: Callbacks): Promise<void>;
}
