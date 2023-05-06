import {
  hasOptionalKeyType,
  hasRequiredKeyType,
  isArray,
} from '@cosmos-kit/core';
import { GenericEthDoc } from '../types';

export const GenericEthDocValidator = {
  isHexString(doc: unknown, options?: unknown): doc is GenericEthDoc.HexString {
    return typeof doc == 'string' && doc.startsWith('0x');
  },
  isTransaction(
    doc: unknown,
    options?: unknown
  ): doc is GenericEthDoc.Transaction {
    return (
      hasRequiredKeyType(doc, {
        from: 'string',
        data: 'string',
      }) &&
      hasOptionalKeyType(doc, {
        to: 'string',
        gas: 'string',
        gasPrice: 'string',
        value: 'string',
        nonce: 'string',
      }) &&
      doc['from'].startsWith('0x') &&
      doc['data'].startsWith('0x')
    );
  },
  isTypedData(doc: unknown, options?: unknown): doc is GenericEthDoc.TypedData {
    return (
      hasRequiredKeyType(doc, {
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
