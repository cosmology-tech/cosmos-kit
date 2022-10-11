import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { ChainKeplrExtension } from './chain-wallet';
import { KeplrExtensionData } from './types';
export declare class KeplrExtensionWallet extends MainWalletBase<Keplr, KeplrExtensionData, ChainKeplrExtension> {
    constructor(_walletInfo?: Wallet, _chainsInfo?: ChainRecord[]);
    get client(): Keplr | undefined;
    setChains(chainsInfo: ChainRecord[]): void;
    update(): Promise<void>;
}
