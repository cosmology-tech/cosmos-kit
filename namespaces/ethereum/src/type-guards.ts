import { hasKeyType, isArray } from '@cosmos-kit/core';
import { EthereumDoc } from './types';

export const EthereumDocValidator = {
  isHexString(doc: unknown): doc is EthereumDoc.HexString {
    return typeof doc == 'string' && doc.startsWith('0x');
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
