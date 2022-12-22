import { ChainContext, ChainName, WalletManager } from '@cosmos-kit/core';
export declare const useWallet: () => WalletManager;
export declare const useChain: (chainName: ChainName) => ChainContext;
export declare const useIcnsNames: (swrNamespace?: string) => {
    icnsNames: {
        primaryName: string;
        names: string[];
    };
    isLoading: boolean;
    error: any | undefined;
};
