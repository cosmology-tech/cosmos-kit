import { StdSignature } from '@cosmjs/amino';
import {
  ChainRecord,
  Namespace,
  Wallet,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';

import { ChainWC } from './chain-wallet';
import { WCClient } from './client';

export interface IChainWC {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWC;
}

export interface IWCClient {
  new (walletInfo: Wallet, options?: WalletConnectOptions): WCClient;
}

export interface WCDirectSignDoc {
  chainId: string;
  accountNumber: string;
  authInfoBytes: string;
  bodyBytes: string;
}

export interface WCSignDirectRequest {
  signerAddress: string;
  signDoc: WCDirectSignDoc;
}

export interface WCSignDirectResponse {
  signature: StdSignature;
  signed: WCDirectSignDoc;
}

export interface WCAccount {
  address: string;
  algo: string;
  pubkey: string;
}

export interface WalletConnectOptions extends WalletClientOptions {
  enableOptions?: EnableOptionsMap;
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
