import {
  hasRequiredKeyType,
  isArray,
  KeyToType,
  Options,
} from '@cosmos-kit/core';
import { AddChainParams } from '../types';

const currencyKeyToType: KeyToType = {
  coinDenom: 'string',
  coinMinimalDenom: 'string',
  coinDecimals: 'number',
};

export const AddChainParamsDiscriminator = {
  Cosmos: {
    isChainInfo(
      params: unknown,
      options?: Options
    ): params is AddChainParams.Cosmos.ChainInfo {
      return (
        hasRequiredKeyType(params, {
          rpc: 'string',
          rest: 'string',
          chainId: 'string',
          chainName: 'string',
        }) &&
        hasRequiredKeyType(params?.['stakeCurrency'], currencyKeyToType) &&
        isArray(params?.['currencies'], currencyKeyToType) &&
        isArray(params?.['feeCurrencies'], currencyKeyToType)
      );
    },
  },
};
