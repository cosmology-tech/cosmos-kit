import { isArray, Options } from '@cosmos-kit/core';
import { BroadcastParams } from '../types';

export const BroadcastParamsDiscriminator = {
  Cosmos: {
    isTransaction(
      params: unknown,
      options?: Options
    ): params is BroadcastParams.Cosmos.Transaction {
      return typeof params === 'string' || isArray(params, 'Uint8Array');
    },
  },
};
