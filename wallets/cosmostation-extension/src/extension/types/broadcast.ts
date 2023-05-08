import { ChainId } from '@cosmos-kit/core';
import {
  SendTransactionMode,
  SendTransactionResponse,
} from '@cosmostation/extension-client/types/message';

export type BroadcastParamsType = BroadcastParams.Cosmos.Transaction;

export namespace BroadcastParams {
  export namespace Cosmos {
    export interface Transaction {
      chainName: ChainId;
      txBytes: string | Uint8Array;
      mode: SendTransactionMode;
    }
  }
}

export namespace BroadcastResult {
  export namespace Cosmos {
    export type Transaction = SendTransactionResponse;
  }
}
