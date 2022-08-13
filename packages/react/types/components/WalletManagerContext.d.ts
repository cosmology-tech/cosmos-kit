/// <reference types="react" />
import { ChainInfo } from '@keplr-wallet/types';
import { IWalletManagerContext, UseWalletResponse } from '../types';
export declare const WalletManagerContext: import("react").Context<IWalletManagerContext>;
export declare const useWalletManager: () => IWalletManagerContext;
export declare const useWallet: (chainId?: ChainInfo['chainId']) => UseWalletResponse;
