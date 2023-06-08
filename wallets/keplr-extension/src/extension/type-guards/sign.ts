import {
  hasOptionalKeyType,
  hasRequiredKeyType,
  isArray,
  Options,
} from '@cosmos-kit/core';
import { SignParams } from '../types';

export const SignParamsDiscriminator = {
  Cosmos: {
    isAmino(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.Amino {
      return hasRequiredKeyType(params?.['signDoc'], {
        chain_id: 'string',
        account_number: 'string',
        sequence: 'string',
      });
    },
    isDirect(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.Direct {
      if (isArray(params?.['signDoc']?.['bodyBytes'], 'Uint8Array')) {
        return true;
      }
      if (isArray(params?.['signDoc']?.['authInfoBytes'], 'Uint8Array')) {
        return true;
      }
      if (
        hasOptionalKeyType(params?.['accountNumber'], {
          high: 'number',
          low: 'number',
          unsigned: 'boolean',
        })
      ) {
        return true;
      }
    },
    isICNSAdr36(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.ICNSAdr36 {
      return hasRequiredKeyType(params, {
        contractAddress: 'string',
        owner: 'string',
        username: 'string',
      });
    },
    isArbitrary(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.ICNSAdr36 {
      return (
        typeof params?.['data'] === 'string' ||
        isArray(params?.['data'], 'Uint8Array')
      );
    },
  },
  Ethereum: {
    isICNSAdr36(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.ICNSAdr36 {
      return hasRequiredKeyType(params, {
        contractAddress: 'string',
        owner: 'string',
        username: 'string',
      });
    },
    isEthereum(
      params: unknown,
      options?: Options
    ): params is SignParams.Cosmos.ICNSAdr36 {
      return (
        typeof params?.['data'] === 'string' ||
        isArray(params?.['data'], 'Uint8Array')
      );
    },
  },
};
