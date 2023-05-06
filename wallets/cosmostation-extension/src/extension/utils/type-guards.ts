import { hasRequiredKeyType, isArray } from '@cosmos-kit/core';
import { GenericCosmosDocValidator } from '@cosmos-kit/cosmos';
import { GenericEthDocValidator } from '@cosmos-kit/ethereum';
import { BroadcastParams, CosmostationOptions, SignParams } from '../types';

export const SignParamsValidator = {
  Cosmos: {
    isMessage: GenericCosmosDocValidator.isMessage,
    isAmino: GenericCosmosDocValidator.isAmino,
    isDirect(
      params: unknown,
      options?: unknown
    ): params is SignParams.Cosmos.Direct {
      return hasRequiredKeyType(params, {
        chain_id: 'string',
        account_number: 'number',
        body_bytes: 'Uint8Array',
        auth_info_bytes: 'Uint8Array',
      });
    },
  },
  Ethereum: {
    isSign(
      params: unknown,
      options?: unknown
    ): params is SignParams.Ethereum.Sign {
      const [signer, doc] = params as any;
      return typeof doc == 'string' && typeof signer == 'string';
    },
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is SignParams.Ethereum.Transaction {
      return (
        Array.isArray(params) &&
        params.every((doc) => GenericEthDocValidator.isTransaction(doc))
      );
    },
    isTypedDataV3(
      params: unknown,
      options?: CosmostationOptions['signOptions']
    ): params is SignParams.Ethereum.TypedData {
      if (typeof options?.ethereum?.signTypedData === 'undefined') {
        throw new Error('Please set `ethereum.signTypedData` in options.');
      }
      const [signer, doc] = params as any;
      return (
        options?.ethereum?.signTypedData === 'v3' &&
        typeof signer === 'string' &&
        GenericEthDocValidator.isTypedData(doc)
      );
    },
    isTypedDataV4(
      params: unknown,
      options?: CosmostationOptions['signOptions']
    ): params is SignParams.Ethereum.TypedData {
      if (typeof options?.ethereum?.signTypedData === 'undefined') {
        throw new Error('Please set `ethereum.signTypedData` in options.');
      }
      const [signer, doc] = params as any;
      return (
        options?.ethereum?.signTypedData === 'v4' &&
        typeof signer === 'string' &&
        GenericEthDocValidator.isTypedData(doc)
      );
    },
  },
};

export const BroadcastParamsValidator = {
  Cosmos: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is BroadcastParams.Cosmos.Transaction {
      return typeof params === 'string' || isArray(params, 'Uint8Array');
    },
  },
};

export const AptosSignParamsValidator = {
  isMessage(params: unknown, options?: unknown): params is AptosDoc.Message {
    return (
      typeof params === 'string' ||
      hasRequiredKeyType(params, { message: 'string', nounce: 'number' })
    );
  },
  isTransaction(
    params: unknown,
    options?: unknown
  ): params is AptosDoc.Transaction {
    return (
      hasRequiredKeyType(params, { function: 'string', type: 'number' }) &&
      isArray(params['type_arguments'], 'string') &&
      isArray(params['arguments'])
    );
  },
};

export const SuiSignParamsValidator = {
  isTransaction(
    params: unknown,
    options?: unknown
  ): params is SuiDoc.Transaction {
    return hasRequiredKeyType(params, { kind: 'string', data: 'object' });
  },
};
