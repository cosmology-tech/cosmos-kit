import { TypeParams } from '@cosmos-kit/core';
import { AddChainParamsType } from './add-chain';

export interface KeplrTypeParams extends TypeParams {
  addChain: AddChainParamsType;
}
