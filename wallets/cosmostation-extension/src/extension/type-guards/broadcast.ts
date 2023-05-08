import { isArray } from '@cosmos-kit/core';
import { BroadcastParams } from '../types';

export const BroadcastParamsValidator = {
  Cosmos: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is BroadcastParams.Cosmos.Transaction {
      return typeof params === 'string' || isArray(params, 'Uint8Array');
    },
  },
};
