import { AssetList, Chain } from '@chain-registry/types';
import { EndpointOptions, LogLevel, MainWalletBase, NameServiceName, SessionOptions, SignerOptions, WalletConnectOptions, WalletManager, WalletModalProps } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';
export declare const walletContext: React.Context<{
    walletManager: WalletManager;
}>;
export declare const ChainProvider: ({ chains, assetLists, wallets, walletModal, modalTheme, wrappedWithChakra, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: (props: WalletModalProps) => JSX.Element;
    modalTheme?: Record<string, any>;
    wrappedWithChakra?: boolean;
    defaultNameService?: NameServiceName;
    walletConnectOptions?: WalletConnectOptions;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    logLevel?: LogLevel;
    children: ReactNode;
}) => JSX.Element;
