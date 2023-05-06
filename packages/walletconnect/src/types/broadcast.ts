export type BroadcastParamsType = BroadcastParams.Ethereum.RawTransaction;

export namespace BroadcastParams {
  export namespace Ethereum {
    export type RawTransaction = string[];
  }
}

export namespace BroadcastResult {
  export namespace Ethereum {
    export type RawTransaction = string;
  }
}
