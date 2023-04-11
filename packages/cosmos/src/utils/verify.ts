import { ChainName } from '@cosmos-kit/core';
import { chains } from 'chain-registry';
import { DirectSignDoc } from '../types';

export function isCosmosChain(chainName: ChainName) {
  if (chains.findIndex((chain) => chain.chain_name === chainName) === -1) {
    return false;
  } else {
    return true;
  }
}

export function isDirectDoc(doc: unknown) {
  return Object.values(doc).findIndex((v) => ArrayBuffer.isView(v)) !== -1;
}
