export { useChain } from './hooks/useChain.js';
export { useChainWallet } from './hooks/useChainWallet.js';
export { useManager } from './hooks/useManager.js';
export { useNameService } from './hooks/useNameService.js';
export { useWallet } from './hooks/useWallet.js';
export { useWalletClient } from './hooks/useWalletClient.js';
import { Chain, AssetList } from '@chain-registry/types';
import { WalletManager, MainWalletBase, WalletModalProps, NameServiceName, WalletConnectOptions, SignerOptions, EndpointOptions, SessionOptions, LogLevel } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';

declare const walletContext: React.Context<{
    walletManager: WalletManager;
    modalProvided: boolean;
}>;
declare const ChainProvider: ({ chains, assetLists, wallets, walletModal, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: (props: WalletModalProps) => JSX.Element;
    throwErrors?: boolean;
    defaultNameService?: NameServiceName;
    walletConnectOptions?: WalletConnectOptions;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    logLevel?: LogLevel;
    children: ReactNode;
}) => JSX.Element;

export { ChainProvider, walletContext };
