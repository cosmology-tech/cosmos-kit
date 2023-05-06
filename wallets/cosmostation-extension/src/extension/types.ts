import { WalletClientOptions } from '@cosmos-kit/core';
import { GenericEthereumDoc } from '@cosmos-kit/ethereum';
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
  | GenericEthereumDoc.HexString
  | GenericEthereumDoc.Transaction
  | GenericEthereumDoc.TypedData
  | AptosDoc.Message
  | AptosDoc.Transaction;
