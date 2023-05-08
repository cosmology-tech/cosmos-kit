import { AptosPendingTransaction } from '@cosmostation/extension-client/types/message';
import { SignParams } from './sign';

export type SignAndBroadcastParamsType =
  | SignAndBroadcastParams.Aptos.Transaction
  | SignAndBroadcastParams.Sui.Transaction;

export namespace SignAndBroadcastParams {
  export namespace Aptos {
    export type Transaction = SignParams.Aptos.Transaction;
  }

  export namespace Sui {
    export type Transaction = any;
  }
}

export namespace SignAndBroadcastResult {
  export namespace Aptos {
    export type Transaction = AptosPendingTransaction;
  }

  export namespace Sui {
    export interface Transaction {
      digest: string;
    }
  }
}
