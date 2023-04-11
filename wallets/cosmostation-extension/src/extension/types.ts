import { Algo } from '@cosmjs/proto-signing';
import { Keplr } from '@keplr-wallet/types';
import { Aptos, Cosmos, ethereum } from '@cosmostation/extension-client';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CosmostationSignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface Request {
  method: string;
  params?: object;
}

// export interface Cosmos {
//   request(request: Request): Promise<any>;
//   on(type: string, listener: EventListenerOrEventListenerObject): Event;
//   off(event: Event): void;
// }

export interface Sui {
  connect(): Promise<any>;
  getAccounts(): Promise<string[]>;
  getPublicKey(): Promise<string>;
}

export interface NamespaceClient {
  request: (message: { method: string; params?: unknown }) => Promise<unknown>;
  on: (eventName: string, eventHandler: (event?: unknown) => void) => unknown;
  off: (handler: unknown) => void;
  sendAsync: () => null;
}

export interface Cosmostation {
  cosmos: NamespaceClient;
  ethereum: NamespaceClient;
  aptos: NamespaceClient;
  sui: NamespaceClient;
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
