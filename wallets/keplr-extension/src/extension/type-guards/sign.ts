import {
  hasRequiredKeyType,
  isArray,
  KeyToType,
  Options,
} from '@cosmos-kit/core';
import { SignParams } from '../types';

const currencyKeyToType: KeyToType = {
  coinDenom: 'string',
  coinMinimalDenom: 'string',
  coinDecimals: 'number',
};

export const SignParamsDiscriminator = {
  Cosmos: {
    isAmino(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.Amino {
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
