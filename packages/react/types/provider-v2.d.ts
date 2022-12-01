import { AssetList, Chain } from '@chain-registry/types';
import { EndpointOptions, MainWalletBase, ModalVersion, SessionOptions, SignerOptions, WalletManagerV2, WalletModalPropsV2 } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';
export declare const walletContextV2: React.Context<{
    walletManager: WalletManagerV2;
}>;
export declare const ChainProvider: ({ chains, assetLists, wallets, walletModal, modalTheme, signerOptions, endpointOptions, sessionOptions, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: ModalVersion | ((props: WalletModalPropsV2) => JSX.Element);
    modalTheme?: Record<string, any>;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    children: ReactNode;
}) => JSX.Element;
