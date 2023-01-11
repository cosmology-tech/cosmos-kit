import { AssetList, Chain } from '@chain-registry/types';
import { EndpointOptions, MainWalletBase, ModalVersion, SessionOptions, SignerOptions, WalletManager, WalletModalProps } from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';
import React, { ReactNode } from 'react';
export declare const walletContext: React.Context<{
    walletManager: WalletManager;
}>;
export declare const ChainProvider: ({ chains, assetLists, wallets, walletModal, modalTheme, wcSignClientOptions, signerOptions, endpointOptions, sessionOptions, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: ModalVersion | ((props: WalletModalProps) => JSX.Element);
    modalTheme?: Record<string, any>;
    wcSignClientOptions?: SignClientTypes.Options;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    children: ReactNode;
}) => JSX.Element;
