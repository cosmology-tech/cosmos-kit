import {
  Namespace,
  NamespaceOptions,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';
import { validators } from '../config';

export interface WalletConnectOptions extends WalletClientOptions {
  enableOptions?: EnableOptionsMap;
  signOptions?: SignOptionsMap;
  broadcastOptions?: BroadcastOptionsMap;
  signAndBroadcastOptions?: SignAndBroadcastOptionsMap;
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

export interface SignOptionsMap extends NamespaceOptions {
  cosmos?: {
    method?: keyof typeof validators.sign.cosmos;
  };
  ethereum?: {
    method?: keyof typeof validators.sign.ethereum;
  };
  everscale?: {
    method?: keyof typeof validators.sign.everscale;
  };
  solana?: {
    method?: keyof typeof validators.sign.solana;
  };
  stella?: {
    method?: keyof typeof validators.sign.stella;
  };
  tezos?: {
    method?: keyof typeof validators.sign.tezos;
  };
  near?: {
    method?: keyof typeof validators.sign.near;
  };
  xrpl?: {
    method?: keyof typeof validators.sign.xrpl;
  };
}

export interface BroadcastOptionsMap extends NamespaceOptions {
  ethereum?: {
    method?: keyof typeof validators.broadcast.ethereum;
  };
}

export interface SignAndBroadcastOptionsMap extends NamespaceOptions {
  ethereum?: {
    method?: keyof typeof validators.signAndBroadcast.ethereum;
  };
  everscale?: {
    method?: keyof typeof validators.signAndBroadcast.everscale;
  };
  stella?: {
    method?: keyof typeof validators.signAndBroadcast.stella;
  };
  tezos?: {
    method?: keyof typeof validators.signAndBroadcast.tezos;
  };
  xrpl?: {
    method?: keyof typeof validators.signAndBroadcast.xrpl;
  };
}
