import { StdSignature } from '@cosmjs/amino';
import { GenericEthDoc } from '@cosmos-kit/ethereum';
import {
  AptosSignMessageParams,
  AptosSignPayload,
  SignAminoDoc,
  SignDirectDoc,
} from '@cosmostation/extension-client/types/message';

export type SignParamsType =
  | SignParams.Cosmos.Amino
  | SignParams.Cosmos.Direct
  | SignParams.Ethereum.Sign
  | SignParams.Ethereum.Transaction
  | SignParams.Ethereum.TypedData
  | SignParams.Aptos.Message
  | SignParams.Aptos.Transaction
  | SignParams.Sui.Transaction;

export namespace SignParams {
  export namespace Cosmos {
    export type Message = string;
    export type Direct = SignDirectDoc;
    export type Amino = SignAminoDoc;
  }

  export namespace Ethereum {
    export type Sign = [string, string];
    export type Transaction = [string, string];
    export type TypedData = GenericEthDoc.Transaction[];
  }

  export namespace Aptos {
    export type Message = string | AptosSignMessageParams;
    export type Transaction = AptosSignPayload;
  }

  export namespace Sui {
    export type Transaction = {
      kind: string;
      data: object;
    };
  }
}

export namespace SignResult {
  export namespace Cosmos {
    export interface Direct {
      signature: StdSignature;
      signed: SignParams.Cosmos.Direct;
    }
    export interface Amino {
      signature: StdSignature;
      signed: SignParams.Cosmos.Amino;
    }
  }

  export namespace Ethereum {
    export type PersonalSign = string;
    export type Sign = string;
    export type TypedData = string;
    export type Transaction = string;
  }

  export namespace Everscale {
    export interface Sign {
      signature: string;
      pubkey: string;
    }

    export interface Message {
      signed_ext_message: string;
    }
  }

  export namespace Solana {
    export interface Transaction {
      signature: string;
    }
    export type Message = SignResult.Solana.Transaction;
  }

  export namespace Stella {
    export interface XDR {
      signedXDR: string;
    }
  }

  export namespace XRPL {
    export interface Transaction {
      tx_json: {
        TxnSignature: string;
        SigningPubKey: string;
      } & SignParams.XRPL.Transaction['tx_json'];
    }
    export type TransactionFor = SignResult.XRPL.Transaction;
  }
}
