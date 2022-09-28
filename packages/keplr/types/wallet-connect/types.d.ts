import { ChainWalletDataBase, MainWalletDataBase } from '@cosmos-kit/core';
export interface ChainKeplrMobileData extends ChainWalletDataBase {
    username?: string;
    qrUri?: string;
}
export interface KeplrMobileData extends MainWalletDataBase {
    qrUri?: string;
}
