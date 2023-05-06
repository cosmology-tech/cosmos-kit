import {
  ChainRecord,
  Namespace,
  Wallet,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';

import { ChainWC } from '../chain-wallet';
import { WCClient } from '../client';

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

export interface WalletConnectOptions extends WalletClientOptions {
  enableOptions?: EnableOptionsMap;
  signOptions?: SignOptionsMap;
  initSignClientOptions: {
    projectId: string;
    relayUrl?: string;
  } & SignClientTypes.Options;
}

export interface EnableOptions {
  prefix: string;
  methods: string[];
  events: string[];
}

export type EnableOptionsMap = {
  [k in Namespace]?: EnableOptions;
};

export type SignOptionsMap = {
  ethereum?: {
    signHexString?: 'personal_sign' | 'eth_sign';
  };
};

export type ValidatorMap = { [k in Namespace]?: Record<string, Function> };
