import { ChainName } from '@cosmos-kit/core';
import { chains } from 'chain-registry';

export function isCosmosChain(chainName: ChainName) {
  if (chains.findIndex((chain) => chain.chain_name === chainName) === -1) {
    return false;
  } else {
    return true;
  }
}

export function isCosmosDirectDoc(doc: unknown) {
  return Object.values(doc).findIndex((v) => ArrayBuffer.isView(v)) !== -1;
}
