import { TypeParams } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { AddChainParamsType } from './add-chain';
import { BroadcastParamsType } from './broadcast';
import { SignParamsType } from './sign';
import { SignAndBroadcastParamsType } from './sign-and-broadcast';
import { VerifyParamsType } from './verify';

export interface Request {
  method: string;
  params?: object;
}

export interface Client {
  request: (message: { method: string; params?: unknown }) => Promise<unknown>;
  on: (eventName: string, eventHandler: (event?: unknown) => void) => unknown;
  off: (handler: unknown) => void;
  sendAsync: () => null;
}

export interface Cosmostation {
  cosmos: Client;
  ethereum: Client;
  aptos: Client;
  sui: Client;
  providers: {
    keplr: Keplr;
  };
}

export type WalletAddEthereumChainParam = [
  {
    chainId: string;
    chainName: string;
    blockExplorerUrls?: string[];
    iconUrls?: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    coinGeckoId?: string;
  }
];

export interface CosmostationTypeParams extends TypeParams {
  addChain: AddChainParamsType;
  sign: SignParamsType;
  verify: VerifyParamsType;
  broadcast: BroadcastParamsType;
  signAndBroadcast: SignAndBroadcastParamsType;
}
