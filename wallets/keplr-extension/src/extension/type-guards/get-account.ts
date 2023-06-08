import { hasRequiredKeyType, Options } from '@cosmos-kit/core';
import { GetAccountParams } from '../types';

export const GetAccountParamsDiscriminator = {
  Cosmos: {
    _check: (method: string, params: unknown, options?: Options): boolean => {
      if (typeof options?.methods === 'undefined') {
        throw new Error('Please designate method in options.');
      }
      return (
        options?.methods.includes(method) &&
        hasRequiredKeyType(params, { chainId: 'string' })
      );
    },
    isKey(
      params: unknown,
      options?: Options
    ): params is GetAccountParams.Cosmos.Key {
      return this._check('ikeplr_getKey', params, options);
    },
    isEnigmaPubKey(
      params: unknown,
      options?: Options
    ): params is GetAccountParams.Cosmos.EnigmaPubKey {
      return this._check('ikeplr_getEnigmaPubKey', params, options);
    },
    isEnigmaTxEncryptionKey(
      params: unknown,
      options?: Options
    ): params is GetAccountParams.Cosmos.EnigmaTxEncryptionKey {
      return hasRequiredKeyType(params, { nonce: 'string' });
    },
    isSecret20ViewingKey(
      params: unknown,
      options?: Options
    ): params is GetAccountParams.Cosmos.Secret20ViewingKey {
      return hasRequiredKeyType(params, { contractAddress: 'string' });
    },
  },
};
