import { SignAndBroadcastParams, SignAndBroadcastOptionsMap } from '../types';
import { SignParamsValidator } from './sign';

export const SignAndBroadcastParamsValidator = {
  Aptos: {
    isTransaction(
      params: unknown,
      options?: SignAndBroadcastOptionsMap
    ): params is SignAndBroadcastParams.Aptos.Transaction {
      return SignParamsValidator.Aptos.isTransaction(params);
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
