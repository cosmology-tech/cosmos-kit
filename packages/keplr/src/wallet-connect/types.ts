import { ChainWalletData, MainWalletData } from '@cosmos-kit/core';

export interface ChainWCKeplrData extends ChainWalletData {
  username?: string;
  qrUri?: string;
}

export interface WCKeplrData extends MainWalletData {
  qrUri?: string;
};
