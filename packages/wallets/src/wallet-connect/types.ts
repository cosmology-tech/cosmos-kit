import { ChainWalletData, WalletData } from "@cosmos-kit/core";

export interface ChainWCData extends ChainWalletData {
    username: string;
};

export interface WalletConnectData extends WalletData {
};