import {
  ChainId,
  ChainRecord,
  Namespace,
  TypeParams,
  Wallet,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';

import { ChainWC } from '../chain-wallet';
import { WCClient } from '../client';
import { BroadcastParamsType } from './broadcast';
import { SignParamsType } from './sign';
import { SignAndBroadcastParamsType } from './sign-and-broadcast';

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

export interface WCTypeParams extends TypeParams {
  sign: SignParamsType;
  broadcast: BroadcastParamsType;
  signAndBroadcast: SignAndBroadcastParamsType;
}
