import { isArray } from '@cosmos-kit/core';
import { BroadcastParams } from '../types';

export const BroadcastParamsDiscriminator = {
  Cosmos: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is BroadcastParams.Cosmos.Transaction {
      return typeof params === 'string' || isArray(params, 'Uint8Array');
    },
  },
};
