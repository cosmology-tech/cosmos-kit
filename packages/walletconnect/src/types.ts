import { StdSignature, StdSignDoc } from '@cosmjs/amino';
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
    signHexBytes?: 'personal_sign' | 'eth_sign';
  };
};

export namespace CosmosDoc {
  export interface Direct {
    chainId: string;
    accountNumber: string;
    bodyBytes: string;
    authInfoBytes: string;
  }
  export type Amino = StdSignDoc;
}

export namespace EthereumDoc {
  export type HexBytes = string;
  export interface TypedData {
    domain: object;
    message: object;
    primaryType: string;
    types: {
      EIP712Domain: { name: string; type: string }[];
    };
  }
}

export namespace CosmosSignResponse {
  export interface Direct {
    signature: StdSignature;
    signed: CosmosDoc.Direct;
  }
  export interface Amino {
    signature: StdSignature;
    signed: CosmosDoc.Amino;
  }
}
