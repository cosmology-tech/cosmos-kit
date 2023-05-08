import { hasRequiredKeyType, isArray } from '@cosmos-kit/core';
import { GenericCosmosDoc } from '../types';

export const GenericCosmosDocDiscriminator = {
  isMessage(doc: unknown, options?: unknown): doc is GenericCosmosDoc.Message {
    return typeof doc === 'string';
  },
  isAmino(doc: unknown, options?: unknown): doc is GenericCosmosDoc.Amino {
    return (
      hasRequiredKeyType(doc, {
        chain_id: 'string',
        account_number: 'number',
        sequence: 'string',
        memo: 'string',
      }) &&
      hasRequiredKeyType(doc['fee'], {
        gas: 'string',
      }) &&
      isArray(doc['fee']?.['amount'], {
        denom: 'string',
        amount: 'string',
      }) &&
      isArray(doc['msgs'], {
        type: 'string',
      })
    );
  },
  isDirect(doc: unknown, options?: unknown): doc is GenericCosmosDoc.Direct {
    return (
      hasRequiredKeyType(doc, {
        bodyBytes: 'Uint8Array',
        authInfoBytes: 'Uint8Array',
        chainId: 'string',
      }) &&
      hasRequiredKeyType(doc['accountNumber'], {
        low: 'number',
        high: 'number',
        unsigned: 'boolean',
      })
    );
  },
};
