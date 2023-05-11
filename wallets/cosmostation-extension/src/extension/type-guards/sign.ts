import { hasRequiredKeyType, isArray } from '@cosmos-kit/core';
import { GenericCosmosDocDiscriminator } from '@cosmos-kit/cosmos';
import { SignOptionsMap, SignParams } from '../types';

export const SignParamsDiscriminator = {
  Cosmos: {
    isMessage(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Cosmos.Message {
      return hasRequiredKeyType(params, {
        chainName: 'string',
        signer: 'string',
        message: 'string',
      });
    },
    isAmino(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Cosmos.Amino {
      return (
        hasRequiredKeyType(params, { chainName: 'string' }) &&
        GenericCosmosDocDiscriminator.isAmino(params['doc'])
      );
    },
    isDirect(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Cosmos.Direct {
      return (
        hasRequiredKeyType(params, { chainName: 'string' }) &&
        hasRequiredKeyType(params['doc'], {
          chain_id: 'string',
          account_number: 'number',
          body_bytes: 'Uint8Array',
          auth_info_bytes: 'Uint8Array',
        })
      );
    },
    isArbitrary(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Cosmos.Arbitrary {
      const checkData =
        typeof params['data'] === 'undefined' ||
        isArray(params['data'], 'Uint8Array');
      return (
        hasRequiredKeyType(params, {
          chainId: 'string',
          signer: 'string',
        }) && checkData
      );
    },
  },
  Ethereum: {
    _check: (
      method: string,
      params: unknown,
      options?: SignOptionsMap
    ): boolean => {
      if (typeof options?.ethereum?.method === 'undefined') {
        throw new Error('Please set `ethereum.method` in options.');
      }
      const [signer, doc] = params as any;
      return (
        options?.ethereum?.method === method &&
        typeof doc == 'string' &&
        typeof signer == 'string'
      );
    },
    isSign(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.Sign {
      return this._check('eth_sign', params, options);
    },
    isTransaction(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.Transaction {
      return this._check('eth_signTransaction', params, options);
    },
    isTypedDataV3(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.TypedDataV3 {
      return this._check('eth_signTypedData_v3', params, options);
    },
    isTypedDataV4(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.TypedDataV4 {
      return this._check('eth_signTypedData_v4', params, options);
    },
  },
  Aptos: {
    isMessage(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Aptos.Message {
      return isArray(params, {
        message: 'string',
        nounce: 'number',
      });
    },
    isTransaction(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Aptos.Transaction {
      return (
        hasRequiredKeyType(params[0], { function: 'string', type: 'number' }) &&
        isArray(params[0]?.['type_arguments'], 'string') &&
        isArray(params[0]?.['arguments'])
      );
    },
  },
};
