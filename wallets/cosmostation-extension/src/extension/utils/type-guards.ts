import { hasRequiredKeyType, isArray } from '@cosmos-kit/core';
import { GenericCosmosSignParamsValidator } from '@cosmos-kit/cosmos';
import { AptosDoc, CosmosDoc, SuiDoc } from '../types';

export const CosmosSignParamsValidator = {
  ...GenericCosmosSignParamsValidator,
  isDirect(doc: unknown, options?: unknown): doc is CosmosDoc.Direct {
    return hasRequiredKeyType(doc, {
      chain_id: 'string',
      account_number: 'number',
      body_bytes: 'Uint8Array',
      auth_info_bytes: 'Uint8Array',
    });
  },
  isTransaction(doc: unknown, options?: unknown): doc is CosmosDoc.Transaction {
    return typeof doc === 'string' || isArray(doc, 'Uint8Array');
  },
};

export const AptosSignParamsValidator = {
  isMessage(doc: unknown, options?: unknown): doc is AptosDoc.Message {
    return (
      typeof doc === 'string' ||
      hasRequiredKeyType(doc, { message: 'string', nounce: 'number' })
    );
  },
  isTransaction(doc: unknown, options?: unknown): doc is AptosDoc.Transaction {
    return (
      hasRequiredKeyType(doc, { function: 'string', type: 'number' }) &&
      isArray(doc['type_arguments'], 'string') &&
      isArray(doc['arguments'])
    );
  },
};

export const SuiSignParamsValidator = {
  isTransaction(doc: unknown, options?: unknown): doc is SuiDoc.Transaction {
    return hasRequiredKeyType(doc, { kind: 'string', data: 'object' });
  },
};
