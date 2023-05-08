import { ChainRecord, Wallet } from '@cosmos-kit/core';

import { ChainWC } from '../chain-wallet';
import { WCClient } from '../client';
import { WalletConnectOptions } from './options';

export interface IChainWC {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWC;
}

export interface IWCClient {
  new (walletInfo: Wallet, options?: WalletConnectOptions): WCClient;
}

export interface RequestAccount1 {
  address: string;
  algo: string;
  pubkey: string;
}

export interface RequestAccount2 {
  pubkey: string;
}

export interface RequestAccount3 {
  accountId: string;
  pubkey: string;
}
