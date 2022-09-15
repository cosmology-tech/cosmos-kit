import { ChainWalletData, MainWalletData } from '@cosmos-kit/core';

export interface ChainExtKeplrData extends ChainWalletData {
  username: string;
}

export interface ExtKeplrData extends MainWalletData {};
