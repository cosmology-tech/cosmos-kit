import { ChainWalletDataBase, MainWalletDataBase } from '@cosmos-kit/core';

export interface ChainCosmostationMobileData extends ChainWalletDataBase {
  username?: string;
  qrUri?: string;
}

export interface CosmostationMobileData extends MainWalletDataBase {
  qrUri?: string;
}
