import { WalletClientOptions } from '@cosmos-kit/core';
import {
  AptosSignMessageParams,
  AptosSignPayload,
  SignAminoDoc,
  SignDirectDoc,
  SignOptions,
} from '@cosmostation/extension-client/types/message';
import { Keplr } from '@keplr-wallet/types';

export interface CosmostationOptions extends WalletClientOptions {
  signOptions?: SignOptions;
}

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

export namespace CosmosDoc {
  export type Message = string;
  export type Direct = SignDirectDoc;
  export type Amino = SignAminoDoc;
  export type Transaction = string | Uint8Array;
}

export namespace EthereumDoc {
  export type Message = string;
  export type Transaction = {
    from: string;
    data: string;
  };
  export interface TypedData {
    domain: object;
    message: object;
    primaryType: string;
    types: {
      EIP712Domain: { name: string; type: string }[];
    };
  }
}

export namespace AptosDoc {
  export type Message = string | AptosSignMessageParams;
  export type Transaction = AptosSignPayload;
}

export namespace SuiDoc {
  export type Transaction = {
    kind: string;
    data: object;
  };
}

export type SignDoc =
  | CosmosDoc.Message
  | CosmosDoc.Direct
  | CosmosDoc.Amino
  | EthereumDoc.Message
  | EthereumDoc.Transaction
  | EthereumDoc.TypedData
  | AptosDoc.Message
  | AptosDoc.Transaction;
