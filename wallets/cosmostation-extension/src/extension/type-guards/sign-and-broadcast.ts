import { SignAndBroadcastParams, SignAndBroadcastOptionsMap } from '../types';
import { SignParamsDiscriminator } from './sign';

export const SignAndBroadcastParamsDiscriminator = {
  Aptos: {
    isTransaction(
      params: unknown,
      options?: SignAndBroadcastOptionsMap
    ): params is SignAndBroadcastParams.Aptos.Transaction {
      return SignParamsDiscriminator.Aptos.isTransaction(params);
    },
  },
  Sui: {
    isTransaction(
      params: unknown,
      options?: SignAndBroadcastOptionsMap
    ): params is SignAndBroadcastParams.Sui.Transaction {
      return true;
    },
  },
};
