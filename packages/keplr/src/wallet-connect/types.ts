import { ChainWalletData, WalletData } from '@cosmos-kit/core';

export interface ChainWCKeplrData extends ChainWalletData {
  username?: string;
  qrUri?: string;
}

export interface WCKeplrData extends WalletData {
  qrUri?: string;
};
