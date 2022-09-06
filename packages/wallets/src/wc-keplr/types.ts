import { ChainWalletData, WalletData } from '@cosmos-kit/core';

export interface ChainWCKeplrData extends ChainWalletData {
  username: string;
}

export type WCKeplrData = WalletData;
