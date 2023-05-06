import { SignParams, SignResult } from './sign';

export type SignAndBroadcastParamsType =
  | SignAndBroadcastParams.Stella.XDR
  | SignAndBroadcastParams.XRPL.Transaction
  | SignAndBroadcastParams.XRPL.TransactionFor;

export namespace SignAndBroadcastParams {
  export namespace Stella {
    export type XDR = SignParams.Stella.XDR;
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
  export namespace Stella {
    export interface XDR {
      status: 'success' | 'pending';
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
