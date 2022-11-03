import { ChainWalletDataBase, MainWalletDataBase } from '@cosmos-kit/core';

export interface ChainCosmostationExtensionData extends ChainWalletDataBase {
  username?: string;
}
export declare type CosmostationExtensionData = MainWalletDataBase;

export interface CosmostationSignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}
