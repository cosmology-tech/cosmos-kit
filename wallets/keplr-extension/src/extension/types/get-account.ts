import { Key as _Key } from '@keplr-wallet/types';

export type GetAccountParamsType =
  | GetAccountParams.Cosmos.Key
  | GetAccountParams.Cosmos.EnigmaPubKey
  | GetAccountParams.Cosmos.EnigmaTxEncryptionKey
  | GetAccountParams.Cosmos.Secret20ViewingKey;

export namespace GetAccountParams {
  export namespace Cosmos {
    type Base = {
      chainId: string;
    };
    export type Key = Base;
    export type EnigmaPubKey = Base;
    export interface EnigmaTxEncryptionKey extends Base {
      nonce: Uint8Array;
    }
    export interface Secret20ViewingKey extends Base {
      contractAddress: string;
    }
  }
}

export namespace GetAccountResp {
  export namespace Cosmos {
    export type Key = _Key;
    export type EnigmaPubKey = Uint8Array;
    export type EnigmaTxEncryptionKey = Uint8Array;
    export type Secret20ViewingKey = string;
  }
}
