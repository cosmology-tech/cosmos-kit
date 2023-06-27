export { useChain, useChainWallet, useManager, useNameService, useWallet, useWalletClient, walletContext } from '@cosmos-kit/react-lite';
export { DefaultModal, WalletModal } from './modal/index.js';
export { addSemanticTokens, defaultTheme, noCssResetTheme } from './modal/theme.js';
import { Chain, AssetList } from '@chain-registry/types';
import { MainWalletBase, WalletModalProps, ModalViews, NameServiceName, WalletConnectOptions, SignerOptions, EndpointOptions, SessionOptions, LogLevel } from '@cosmos-kit/core';
import { ReactNode } from 'react';
export { useModalTheme } from './hooks/useModalTheme.js';

declare const ChainProvider: ({ chains, assetLists, wallets, walletModal, modalTheme, modalViews, includeAllWalletsOnMobile, wrappedWithChakra, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: (props: WalletModalProps) => JSX.Element;
    modalTheme?: Record<string, any>;
    modalViews?: ModalViews;
    includeAllWalletsOnMobile?: boolean;
    wrappedWithChakra?: boolean;
    throwErrors?: boolean;
    defaultNameService?: NameServiceName;
    walletConnectOptions?: WalletConnectOptions;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    logLevel?: LogLevel;
    children: ReactNode;
}) => JSX.Element;

export { ChainProvider };
