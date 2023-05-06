import { SignParams, SignResult } from './sign';

export type SignAndBroadcastParamsType =
  | SignAndBroadcastParams.Ethereum.Transaction
  | SignAndBroadcastParams.Everscale.Message
  | SignAndBroadcastParams.Stella.XDR
  | SignAndBroadcastParams.XRPL.Transaction
  | SignAndBroadcastParams.XRPL.TransactionFor;

export namespace SignAndBroadcastParams {
  export namespace Ethereum {
    export type Transaction = SignParams.Ethereum.Transaction; // gasLimit in wc example?
  }

  export namespace Everscale {
    export type Message = SignParams.Everscale.Message;
  }

  export namespace Stella {
    export type XDR = SignParams.Stella.XDR;
  }

  export namespace Tezos {
    export interface Send {
      account: string;
      operations: {
        kind: string;
        destination: string;
        amount: string;
        source?: string;
        fee?: string;
        counter?: string;
        gas_limit?: string;
        storage_limit?: string;
        parameters?: object;
      }[];
    }
  }

  export namespace XRPL {
    export interface Transaction {
      tx_json: SignParams.XRPL.Transaction['tx_json'];
      autofill?: boolean;
      submit?: boolean;
    }
    export interface TransactionFor {
      tx_signer: string;
      tx_json: SignParams.XRPL.Transaction['tx_json'];
      autofill?: boolean;
      submit: true;
    }
  }
}

export namespace SignAndBroadcastResult {
  export namespace Ethereum {
    export type Transaction = string;
  }

  export namespace Everscale {
    export interface Message {
      tx_id: string;
    }
  }

  export namespace Stella {
    export interface XDR {
      status: 'success' | 'pending';
    }
  }

  export namespace Tezos {
    export interface Send {
      operation_hash: string;
    }
  }

  export namespace XRPL {
    export interface Transaction {
      tx_json: {
        hash: string;
      } & SignResult.XRPL.Transaction;
    }
    export type TransactionFor = SignAndBroadcastResult.XRPL.Transaction;
  }
}
