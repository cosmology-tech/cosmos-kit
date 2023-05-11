import { Namespace, Dist, Method, WalletClientOptions } from '@cosmos-kit/core';
import { SignOptions } from '@cosmostation/extension-client/types/message';
import { SignClientTypes } from '@walletconnect/types';
import { discriminators } from '../config';

export interface CosmostationOptions extends WalletClientOptions {
  enableOptions?: EnableOptionsMap;
  signOptions?: SignOptionsMap;
  verifyOptions?: VerifyOptionsMap;
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

export interface SignOptionsMap extends Dist<Method> {
  cosmos?: {
    method?: keyof typeof discriminators.sign.cosmos;
  } & CosmosSignOptions;
  ethereum?: {
    method?: keyof typeof discriminators.sign.ethereum;
  };
  aptos?: {
    method?: keyof typeof discriminators.sign.aptos;
  };
  sui?: {
    method?: keyof typeof discriminators.sign.sui;
  };
}

export interface VerifyOptionsMap extends Dist<Method> {
  cosmos?: {
    method?: keyof typeof discriminators.verify.cosmos;
  };
}

export interface BroadcastOptionsMap extends Dist<Method> {
  cosmos?: {
    method?: keyof typeof discriminators.broadcast.cosmos;
  };
}

export interface SignAndBroadcastOptionsMap extends Dist<Method> {
  aptos?: {
    method?: keyof typeof discriminators.signAndBroadcast.aptos;
  };
  sui?: {
    method?: keyof typeof discriminators.signAndBroadcast.sui;
  };
}
