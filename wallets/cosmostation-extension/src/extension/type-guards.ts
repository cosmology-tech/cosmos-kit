import { hasKeyType, isArray } from '@cosmos-kit/core';
import { AptosDoc, CosmosDoc, EthereumDoc, SuiDoc } from './types';

// Cosmos Network

export function isCosmosMessageDoc(doc: unknown): doc is EthereumDoc.Message {
  return typeof doc === 'string';
}

export function isCosmosDirectDoc(doc: unknown): doc is CosmosDoc.Direct {
  return hasKeyType(doc, {
    chain_id: 'string',
    account_number: 'number',
    body_bytes: 'Uint8Array',
    auth_info_bytes: 'Uint8Array',
  });
}

export function isCosmosAminoDoc(doc: unknown): doc is CosmosDoc.Amino {
  return (
    hasKeyType(doc, {
      chain_id: 'string',
      account_number: 'number',
      sequence: 'string',
      memo: 'string',
    }) &&
    hasKeyType(doc['fee'], {
      gas: 'string',
    }) &&
    // isArray(doc['fee']?.['amount'], {
    //   denom: 'string',
    //   amount: 'string',
    // }) &&
    isArray(doc['msgs'], {
      type: 'string',
    })
  );
}

// Ethereum Network

export function isEthMessageDoc(doc: unknown): doc is EthereumDoc.Message {
  return typeof doc === 'string';
}

export function isEthTransactionDoc(doc: unknown) {
  return hasKeyType(doc, {
    from: 'string',
    date: 'string',
  });
}

export function isEthTypedDataDoc(doc: unknown): doc is EthereumDoc.TypedData {
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
}

// Apots Network

export function isAptosMessageDoc(doc: unknown): doc is AptosDoc.Message {
  return (
    typeof doc === 'string' ||
    hasKeyType(doc, { message: 'string', nounce: 'number' })
  );
}

export function isAptosTransactionDoc(
  doc: unknown
): doc is AptosDoc.Transaction {
  return (
    hasKeyType(doc, { function: 'string', type: 'number' }) &&
    isArray(doc['type_arguments'], 'string') &&
    isArray(doc['arguments'])
  );
}

// Sui Network

export function isSuiTransactionDoc(doc: unknown): doc is SuiDoc.Transaction {
  return hasKeyType(doc, { kind: 'string', data: 'object' });
}
