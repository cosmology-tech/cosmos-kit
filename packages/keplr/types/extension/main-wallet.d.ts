import { Callbacks, ChainRecord, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { ChainKeplrExtension } from './chain-wallet';
import { KeplrExtensionData } from './types';
export declare class KeplrExtensionWallet extends MainWalletBase<Keplr, KeplrExtensionData, ChainKeplrExtension> {
    constructor(walletInfo?: Wallet, chains?: ChainRecord[]);
    setChains(chains: ChainRecord[]): void;
    fetchClient(): Promise<Keplr>;
    update(callbacks?: Callbacks): Promise<void>;
}
