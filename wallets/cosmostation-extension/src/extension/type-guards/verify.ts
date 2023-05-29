import { Options } from '@cosmos-kit/core';
import { VerifyParams } from '../types';
import { SignParamsDiscriminator } from './sign';

export const VerifyParamsDiscriminator = {
  Cosmos: {
    isMessage(
      params: unknown,
      options?: Options
    ): params is VerifyParams.Cosmos.Message {
      return SignParamsDiscriminator.Cosmos.isMessage(params);
    },
    isArbitrary(
      params: unknown,
      options?: Options
    ): params is VerifyParams.Cosmos.Arbitrary {
      return SignParamsDiscriminator.Cosmos.isArbitrary(params);
    },
  },
};
