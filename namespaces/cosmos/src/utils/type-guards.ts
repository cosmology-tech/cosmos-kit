import { ChainName, hasKeyType, isArray } from '@cosmos-kit/core';
import { chains } from 'chain-registry';
import { StdSignDoc } from '@cosmjs/amino';

export function isCosmosChain(chainName: ChainName) {
  if (chains.findIndex((chain) => chain.chain_name === chainName) === -1) {
    return false;
  } else {
    return true;
  }
}

export function isDirectDoc(doc: unknown): boolean {
  return Object.values(doc).findIndex((v) => isArray(v, 'Uint8Array')) !== -1;
}

export function isAminoDoc(doc: unknown): doc is StdSignDoc {
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
    isArray(doc['fee']?.['amount'], {
      denom: 'string',
      amount: 'string',
    }) &&
    isArray(doc['msgs'], {
      type: 'string',
    })
  );
}
