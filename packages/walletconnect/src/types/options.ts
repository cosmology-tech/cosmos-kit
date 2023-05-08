import {
  Namespace,
  NamespaceOptions,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';
import { discriminators } from '../config';

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
    method?: keyof typeof discriminators.sign.cosmos;
  };
  ethereum?: {
    method?: keyof typeof discriminators.sign.ethereum;
  };
  everscale?: {
    method?: keyof typeof discriminators.sign.everscale;
  };
  solana?: {
    method?: keyof typeof discriminators.sign.solana;
  };
  stella?: {
    method?: keyof typeof discriminators.sign.stella;
  };
  tezos?: {
    method?: keyof typeof discriminators.sign.tezos;
  };
  near?: {
    method?: keyof typeof discriminators.sign.near;
  };
  xrpl?: {
    method?: keyof typeof discriminators.sign.xrpl;
  };
}

export interface BroadcastOptionsMap extends NamespaceOptions {
  ethereum?: {
    method?: keyof typeof discriminators.broadcast.ethereum;
  };
}

export interface SignAndBroadcastOptionsMap extends NamespaceOptions {
  ethereum?: {
    method?: keyof typeof discriminators.signAndBroadcast.ethereum;
  };
  everscale?: {
    method?: keyof typeof discriminators.signAndBroadcast.everscale;
  };
  stella?: {
    method?: keyof typeof discriminators.signAndBroadcast.stella;
  };
  tezos?: {
    method?: keyof typeof discriminators.signAndBroadcast.tezos;
  };
  xrpl?: {
    method?: keyof typeof discriminators.signAndBroadcast.xrpl;
  };
}
