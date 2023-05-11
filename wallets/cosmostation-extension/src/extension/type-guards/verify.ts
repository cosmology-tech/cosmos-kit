import { hasRequiredKeyType, isArray } from '@cosmos-kit/core';
import { GenericCosmosDocDiscriminator } from '@cosmos-kit/cosmos';
import {
  SignOptionsMap,
  SignParams,
  VerifyOptionsMap,
  VerifyParams,
} from '../types';
import { SignParamsDiscriminator } from './sign';

export const VerifyParamsDiscriminator = {
  Cosmos: {
    isMessage(
      params: unknown,
      options?: VerifyOptionsMap
    ): params is VerifyParams.Cosmos.Message {
      return SignParamsDiscriminator.Cosmos.isMessage(params);
    },
    isArbitrary(
      params: unknown,
      options?: VerifyOptionsMap
    ): params is VerifyParams.Cosmos.Arbitrary {
      return SignParamsDiscriminator.Cosmos.isArbitrary(params);
    },
  },
};
