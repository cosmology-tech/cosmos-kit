import { ChainWalletData, WalletData } from "@cosmos-kit/core";

export interface ChainKeplrData extends ChainWalletData {
    username: string;
};

export interface KeplrData extends WalletData {
};