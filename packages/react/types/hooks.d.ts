import { ChainContext, ChainName, ManagerContext, WalletManager } from '@cosmos-kit/core';
export declare const useWallet: () => WalletManager;
export declare const useManager: () => ManagerContext;
export declare const useChain: (chainName: ChainName) => ChainContext;
