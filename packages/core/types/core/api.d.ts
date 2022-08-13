import { CosmosWalletInitializeConfig, CosmosWalletStateObserver, Wallet } from '../types';
export declare const initialize: (initialConfig: CosmosWalletInitializeConfig, observers?: CosmosWalletStateObserver[]) => void;
export declare const cleanupAfterConnection: () => void;
export declare const connectToWallet: (wallet: Wallet) => Promise<void>;
export declare const beginConnection: (wallet?: Wallet) => Promise<void>;
export declare const disconnect: (dontKillWalletConnect?: boolean) => Promise<void>;
export declare const reset: () => Promise<void>;
export declare const stopConnecting: () => void;
