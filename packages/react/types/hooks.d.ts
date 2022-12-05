import { ChainContext, ChainName, WalletManager } from '@cosmos-kit/core';
export declare const useWallet: () => WalletManager;
export declare const useChain: (chainName: ChainName) => ChainContext;
