import { ChainName, isArray } from '@cosmos-kit/core';
import { chains } from 'chain-registry';

export function isCosmosChain(chainName: ChainName) {
  if (chains.findIndex((chain) => chain.chain_name === chainName) === -1) {
    return false;
  } else {
    return true;
  }
}

export function isCosmosDirectDoc(doc: unknown): boolean {
  return Object.values(doc).findIndex((v) => isArray(v, 'Uint8Array')) !== -1;
}
