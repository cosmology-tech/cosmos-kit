import { AssetList, Chain } from '@chain-registry/types';
import { EndpointOptions, LogLevel, MainWalletBase, NameServiceName, SessionOptions, SignerOptions, WalletConnectOptions, WalletManager, WalletModalProps } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';
export declare const walletContext: React.Context<{
    walletManager: WalletManager;
    modalProvided: boolean;
}>;
export declare const ChainProvider: ({ chains, assetLists, wallets, walletModal, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel, children, }: {
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
