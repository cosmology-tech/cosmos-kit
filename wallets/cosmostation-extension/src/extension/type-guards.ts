import { hasKeyType, isArray } from '@cosmos-kit/core';
import {
  AptosSignDoc,
  CosmosBroadcastDoc,
  CosmosSignDoc,
  EthereumSignDoc,
  SuiSignDoc,
} from './types';

// Cosmos Network

export function isCosmosMessageSignDoc(
  doc: unknown
): doc is EthereumSignDoc.Message {
  return typeof doc === 'string';
}

export function isCosmosDirectSignDoc(
  doc: unknown
): doc is CosmosSignDoc.Direct {
  return hasKeyType(doc, {
    chain_id: 'string',
    account_number: 'number',
    body_bytes: 'Uint8Array',
    auth_info_bytes: 'Uint8Array',
  });
}

export function isCosmosAminoSignDoc(doc: unknown): doc is CosmosSignDoc.Amino {
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

export function isCosmosTransactionBroadcastDoc(
  doc: unknown
): doc is CosmosBroadcastDoc.Transaction {
  return typeof doc === 'string' || isArray(doc, 'Uint8Array');
}

// Ethereum Network

export function isEthMessageSignDoc(
  doc: unknown
): doc is EthereumSignDoc.Message {
  return typeof doc === 'string';
}

export function isEthTransactionSignDoc(doc: unknown) {
  return hasKeyType(doc, {
    from: 'string',
    date: 'string',
  });
}

export function isEthTypedDataSignDoc(
  doc: unknown
): doc is EthereumSignDoc.TypedData {
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

export function isAptosMessageSignDoc(
  doc: unknown
): doc is AptosSignDoc.Message {
  return (
    typeof doc === 'string' ||
    hasKeyType(doc, { message: 'string', nounce: 'number' })
  );
}

export function isAptosTransactionSignDoc(
  doc: unknown
): doc is AptosSignDoc.Transaction {
  return (
    hasKeyType(doc, { function: 'string', type: 'number' }) &&
    isArray(doc['type_arguments'], 'string') &&
    isArray(doc['arguments'])
  );
}

// Sui Network

export function isSuiTransactionSignDoc(
  doc: unknown
): doc is SuiSignDoc.Transaction {
  return hasKeyType(doc, { kind: 'string', data: 'object' });
}
