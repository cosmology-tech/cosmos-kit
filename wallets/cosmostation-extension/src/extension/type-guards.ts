import { hasKeyType, isArray } from '@cosmos-kit/core';
import { isAminoDoc } from '@cosmos-kit/cosmos';
import { AptosDoc, CosmosDoc, EthereumDoc, SuiDoc } from './types';

export const CosmosDocValidator = {
  isMessage(doc: unknown): doc is CosmosDoc.Message {
    return typeof doc === 'string';
  },
  isDirect(doc: unknown): doc is CosmosDoc.Direct {
    return hasKeyType(doc, {
      chain_id: 'string',
      account_number: 'number',
      body_bytes: 'Uint8Array',
      auth_info_bytes: 'Uint8Array',
    });
  },
  isAmino(doc: unknown): doc is CosmosDoc.Amino {
    return isAminoDoc(doc);
  },
  isTransaction(doc: unknown): doc is CosmosDoc.Transaction {
    return typeof doc === 'string' || isArray(doc, 'Uint8Array');
  },
};

export const EthereumDocValidator = {
  isMessage(doc: unknown): doc is EthereumDoc.Message {
    return typeof doc === 'string';
  },
  isTransaction(doc: unknown): doc is EthereumDoc.Transaction {
    return hasKeyType(doc, {
      from: 'string',
      date: 'string',
    });
  },
  isTypedData(doc: unknown): doc is EthereumDoc.TypedData {
    return (
      hasKeyType(doc, {
        domain: 'object',
        message: 'object',
        primaryType: 'string',
      }) &&
      isArray(doc['types']?.['EIP712Domain'], {
        name: 'string',
        type: 'string',
      })
    );
  },
};

export const AptosDocValidator = {
  isMessage(doc: unknown): doc is AptosDoc.Message {
    return (
      typeof doc === 'string' ||
      hasKeyType(doc, { message: 'string', nounce: 'number' })
    );
  },
  isTransaction(doc: unknown): doc is AptosDoc.Transaction {
    return (
      hasKeyType(doc, { function: 'string', type: 'number' }) &&
      isArray(doc['type_arguments'], 'string') &&
      isArray(doc['arguments'])
    );
  },
};

export const SuiDocValidator = {
  isTransaction(doc: unknown): doc is SuiDoc.Transaction {
    return hasKeyType(doc, { kind: 'string', data: 'object' });
  },
};
