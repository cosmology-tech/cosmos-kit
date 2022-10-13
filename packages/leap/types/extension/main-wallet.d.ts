import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { ChainLeapExtension } from './chain-wallet';
import { Leap, LeapExtensionData } from './types';
export declare class LeapExtensionWallet extends MainWalletBase<Leap, LeapExtensionData, ChainLeapExtension> {
    constructor(walletInfo?: Wallet, chains?: ChainRecord[]);
    setChains(chains: ChainRecord[]): void;
    fetchClient(): Promise<Leap>;
    update(): void;
}
