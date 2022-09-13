import { ChainWalletData, WalletData } from '@cosmos-kit/core';

export interface ChainKeplrData extends ChainWalletData {
  username: string;
}

export type KeplrData = WalletData;
