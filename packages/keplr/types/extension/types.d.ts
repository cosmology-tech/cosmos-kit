import { ChainWalletDataBase, MainWalletDataBase } from '@cosmos-kit/core';
export interface ChainKeplrExtensionData extends ChainWalletDataBase {
    username?: string;
}
export interface KeplrExtensionData extends MainWalletDataBase {
}
