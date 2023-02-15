import { ChainRecord, ChainWalletBase, Wallet, WalletConnectOptions } from '@cosmos-kit/core';
import { WCClient } from './client';
import { IWCClient } from './types';
export declare class ChainWC extends ChainWalletBase {
    WCClient: IWCClient;
    client?: WCClient;
    options?: WalletConnectOptions;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord, WCClient: IWCClient);
}
