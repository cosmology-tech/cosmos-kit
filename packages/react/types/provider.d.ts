import { AssetList, Chain } from '@chain-registry/types';
import { EndpointOptions, MainWalletBase, ModalVersion, SessionOptions, SignerOptions, StorageOptions, ViewOptions, WalletManager, NameResolver } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';
export declare const walletContext: React.Context<{
    walletManager: WalletManager;
}>;
export declare const WalletProvider: ({ chains, assetLists, wallets, walletModal, signerOptions, viewOptions, endpointOptions, storageOptions, sessionOptions, nameResolver, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: ModalVersion | (({ isOpen, setOpen }: WalletModalProps) => JSX.Element);
    signerOptions?: SignerOptions;
    viewOptions?: ViewOptions;
    endpointOptions?: EndpointOptions;
    storageOptions?: StorageOptions;
    sessionOptions?: SessionOptions;
    nameResolver?: NameResolver;
    children: ReactNode;
}) => JSX.Element;
