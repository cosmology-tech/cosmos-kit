import {
  Namespace,
  NamespaceOptions,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { SignOptions } from '@cosmostation/extension-client/types/message';
import { SignClientTypes } from '@walletconnect/types';
import { validators } from '../config';

export interface CosmostationOptions extends WalletClientOptions {
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

export interface CosmosSignOptions {
  isEditMemo?: boolean;
  isEditFee?: boolean;
  gasRate?: SignOptions['gasRate'];
}

export interface SignOptionsMap extends NamespaceOptions {
  cosmos?: {
    method?: keyof typeof validators.sign.cosmos;
  } & CosmosSignOptions;
  ethereum?: {
    method?: keyof typeof validators.sign.ethereum;
  };
  aptos?: {
    method?: keyof typeof validators.sign.aptos;
  };
  sui?: {
    method?: keyof typeof validators.sign.sui;
  };
}

export interface BroadcastOptionsMap extends NamespaceOptions {
  cosmos?: {
    method?: keyof typeof validators.broadcast.cosmos;
  };
}

export interface SignAndBroadcastOptionsMap extends NamespaceOptions {
  aptos?: {
    method?: keyof typeof validators.signAndBroadcast.aptos;
  };
  sui?: {
    method?: keyof typeof validators.signAndBroadcast.sui;
  };
}
