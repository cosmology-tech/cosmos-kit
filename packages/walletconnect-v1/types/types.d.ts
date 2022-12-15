import { ChainRecord, OS, Wallet, WalletClient } from '@cosmos-kit/core';
import { IConnector } from '@walletconnect/types';
import { ChainWCV1 } from './chain-wallet';
export interface IWCClientV1 extends WalletClient {
    readonly connector: IConnector;
    getAppUrl: (os?: OS) => string | undefined;
    readonly qrUrl: string;
}
export interface IChainWC {
    new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWCV1;
}
export interface IWCClient {
    new (): IWCClientV1;
}
