import { Algo } from '@cosmjs/amino';
import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWC } from './chain-wallet';
import { WCClient } from './client';
export interface IChainWC {
    new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWC;
}
export interface IWCClient {
    new (walletInfo: Wallet): WCClient;
}
export interface WCAccount {
    algo: Algo;
    address: string;
    pubkey: string;
}
