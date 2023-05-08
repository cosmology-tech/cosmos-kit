import { BroadcastOptionsMap, BroadcastParams } from '../types';

export const BroadcastParamsDiscriminator = {
  Ethereum: {
    isRawTransaction(
      params: unknown,
      options?: BroadcastOptionsMap
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
