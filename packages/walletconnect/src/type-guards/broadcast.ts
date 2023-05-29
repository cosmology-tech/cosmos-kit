import { Options } from '@cosmos-kit/core';
import { BroadcastParams } from '../types';

export const BroadcastParamsDiscriminator = {
  Ethereum: {
    isRawTransaction(
      params: unknown,
      options?: Options
    ): params is BroadcastParams.Ethereum.RawTransaction {
      return (
        Array.isArray(params) &&
        params.every(
          (signedDoc) =>
            typeof signedDoc === 'string' && signedDoc.startsWith('0x')
        )
      );
    },
  },
};
