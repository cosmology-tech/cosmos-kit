import { ChainInfo } from '@cosmos-kit/core';
import { chains } from 'chain-registry';
import { convertChain } from './utils';

export const chainInfos: ChainInfo[] = chains
  .map((chain) => convertChain(chain));