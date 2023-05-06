export type BroadcastParamsType = BroadcastParams.Cosmos.Transaction;

export namespace BroadcastParams {
  export namespace Cosmos {
    export type Transaction = string | Uint8Array;
  }
}

export namespace BroadcastResult {}
