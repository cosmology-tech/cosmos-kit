import { ChainWalletDataBase, MainWalletDataBase } from '@cosmos-kit/core';

export interface ChainExtKeplrData extends ChainWalletDataBase {
  username: string;
}

export interface ExtKeplrData extends MainWalletDataBase {};
