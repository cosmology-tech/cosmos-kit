import { Options } from '@cosmos-kit/core';
import { SignAndBroadcastParams } from '../types';
import { SignParamsDiscriminator } from './sign';

export const SignAndBroadcastParamsDiscriminator = {
  Aptos: {
    isTransaction(
      params: unknown,
      options?: Options
    ): params is SignAndBroadcastParams.Aptos.Transaction {
      return SignParamsDiscriminator.Aptos.isTransaction(params);
    },
  },
  Sui: {
    isTransaction(
      params: unknown,
      options?: Options
    ): params is SignAndBroadcastParams.Sui.Transaction {
      return true;
    },
  },
};
