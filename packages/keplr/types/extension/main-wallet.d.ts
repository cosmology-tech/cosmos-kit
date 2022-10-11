import { ChainName, ChainRecord, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { ChainKeplrExtension } from './chain-wallet';
import { ChainKeplrExtensionData, KeplrExtensionData } from './types';
export declare class KeplrExtensionWallet extends MainWalletBase<Keplr, KeplrExtensionData, ChainKeplrExtensionData, ChainKeplrExtension> {
    protected _chains: Map<ChainName, ChainKeplrExtension>;
    protected _client: Promise<Keplr | undefined> | undefined;
    constructor(_walletInfo?: Wallet, _chainsInfo?: ChainRecord[]);
    setChains(chainsInfo: ChainRecord[]): void;
    update(): Promise<void>;
}
