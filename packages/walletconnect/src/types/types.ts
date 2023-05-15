import {
  ChainId,
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

export interface WalletConnectOptions extends WalletClientOptions {
  initSignClientOptions: {
    projectId: string;
    relayUrl?: string;
  } & SignClientTypes.Options;
}

export type NamespacesConfig = {
  [k in Namespace]?: {
    prefix: string;
    methods: string[];
    events: string[];
  };
};

export interface GeneralParams {
  chainId: ChainId;
  params?: unknown;
}
