import { ChainRecord } from '@cosmos-kit/core';
import { AddChainParams as CosmosChainInfo } from '@cosmostation/extension-client/types/message';
import { ChainInfo } from '@keplr-wallet/types';

export type AddChainParamsType =
  | ChainInfo
  | ChainRecord
  | AddChainParams.Cosmos.ChainInfo
  | AddChainParams.Ethereum.ChainInfo;

export namespace AddChainParams {
  export namespace Cosmos {
    export type ChainInfo = CosmosChainInfo;
  }
  export namespace Ethereum {
    export type ChainInfo = [
      {
        chainId: string;
        chainName: string;
        blockExplorerUrls?: string[];
        iconUrls?: string[];
        nativeCurrency: {
          name: string;
          symbol: string;
          decimals: number;
        };
        rpcUrls: string[];
        coinGeckoId?: string;
      }
    ];
  }
}
