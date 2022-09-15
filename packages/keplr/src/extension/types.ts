import { ChainWalletData, WalletData } from '@cosmos-kit/core';

export interface ChainExtKeplrData extends ChainWalletData {
  username: string;
}

export interface ExtKeplrData extends WalletData {};
