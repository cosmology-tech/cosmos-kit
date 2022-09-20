import { ChainWalletDataBase, MainWalletDataBase } from '@cosmos-kit/core';

export interface ChainWCKeplrData extends ChainWalletDataBase {
  username?: string;
  qrUri?: string;
}

export interface WCKeplrData extends MainWalletDataBase {
  qrUri?: string;
};
