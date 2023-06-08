import { ChainRecord as _ChainRecord } from '@cosmos-kit/core';
import { ChainInfo as _ChainInfo } from '@keplr-wallet/types';

export type AddChainParamsType =
  | AddChainParams.Cosmos.ChainInfo
  | AddChainParams.Cosmos.ChainRecord;

export namespace AddChainParams {
  export namespace Cosmos {
    export type ChainInfo = _ChainInfo;
    export type ChainRecord = _ChainRecord;
  }
}
