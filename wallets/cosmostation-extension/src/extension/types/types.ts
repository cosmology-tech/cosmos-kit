import { Keplr } from '@keplr-wallet/types';

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
