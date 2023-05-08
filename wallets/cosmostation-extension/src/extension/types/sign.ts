import { ChainId } from '@cosmos-kit/core';
import {
  AptosSignMessageParams,
  AptosSignMessageResponse,
  AptosSignPayload,
  AptosSignTransactionResponse,
  SignAminoDoc,
  SignAminoResponse,
  SignDirectDoc,
  SignDirectResponse,
  SignMessageResponse,
} from '@cosmostation/extension-client/types/message';
import { CosmosSignOptions } from './options';

export type SignParamsType =
  | SignParams.Cosmos.Message
  | SignParams.Cosmos.Amino
  | SignParams.Cosmos.Direct
  | SignParams.Ethereum.Sign
  | SignParams.Ethereum.Transaction
  | SignParams.Ethereum.TypedDataV3
  | SignParams.Ethereum.TypedDataV4
  | SignParams.Aptos.Message
  | SignParams.Aptos.Transaction;

export namespace SignParams {
  export namespace Cosmos {
    interface Doc extends CosmosSignOptions {
      chainName: ChainId;
    }
    export interface Message {
      chainName: ChainId;
      signer: string;
      message: string;
    }
    export interface Direct extends Doc {
      doc: SignDirectDoc;
    }
    export interface Amino extends Doc {
      doc: SignAminoDoc;
    }
  }

  export namespace Ethereum {
    type Signer = string;
    type JSONString = string;
    export type Sign = [Signer, string];
    export type Transaction = [Signer, string];
    export type TypedDataV3 = [Signer, JSONString];
    export type TypedDataV4 = [Signer, JSONString];
  }

  export namespace Aptos {
    export type Message = [AptosSignMessageParams];
    export type Transaction = [AptosSignPayload];
  }
}

export namespace SignResult {
  export namespace Cosmos {
    export type Message = SignMessageResponse;
    export type Direct = SignDirectResponse;
    export type Amino = SignAminoResponse;
  }

  export namespace Ethereum {
    export type Sign = string;
    export type TypedDataV3 = string;
    export type TypedDataV4 = string;
    export type Transaction = string;
  }

  export namespace Aptos {
    export type Message = AptosSignMessageResponse;
    export type Transaction = AptosSignTransactionResponse;
  }
}
