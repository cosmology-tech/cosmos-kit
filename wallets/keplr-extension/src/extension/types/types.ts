import { TypeParams } from '@cosmos-kit/core';
import { AddChainParamsType } from './add-chain';
import { GetAccountParamsType } from './get-account';
import { SignParamsType } from './sign';

export interface KeplrTypeParams extends TypeParams {
  getAccount: GetAccountParamsType;
  addChain: AddChainParamsType;
  sign: SignParamsType;
}
