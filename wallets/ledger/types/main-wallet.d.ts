import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { TransportType } from './utils';
export declare class LedgerMainWallet extends MainWalletBase {
    transportType: TransportType;
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints'], transportType?: TransportType);
    initClient(): Promise<void>;
}
