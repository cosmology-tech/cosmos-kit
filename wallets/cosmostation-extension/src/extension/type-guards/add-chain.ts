import {
  hasOptionalKeyType,
  hasRequiredKeyType,
  Options,
} from '@cosmos-kit/core';
import { AddChainParams } from '../types';

export const AddChainParamsDiscriminator = {
  Cosmos: {
    isChainInfo(
      params: unknown,
      options?: Options
    ): params is AddChainParams.Cosmos.ChainInfo {
      return (
        hasRequiredKeyType(params, {
          restURL: 'string',
          baseDenom: 'string',
          displayDenom: 'string',
          addressPrefix: 'string',
          chainId: 'string',
          chainName: 'string',
        }) &&
        hasOptionalKeyType(params, {
          imageURL: 'string',
          decimals: 'number',
          coinType: 'string',
          coinGeckoId: 'string',
          sendGas: 'string',
        })
      );
    },
  },
  Ethereum: {
    isChainInfo(
      params: unknown,
      options?: Options
    ): params is AddChainParams.Ethereum.ChainInfo {
      return (
        hasRequiredKeyType(params?.[0], {
          chainId: 'string',
          chainName: 'string',
        }) &&
        hasRequiredKeyType(params?.[0]?.['nativeCurrency'], {
          name: 'string',
          symbol: 'string',
          decimals: 'number',
        })
      );
    },
  },
};
