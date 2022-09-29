import { SignerOptions, ViewOptions, WalletManager, WalletOption, EndpointOptions, StorageOptions } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';
import { Chain } from '@chain-registry/types';
export declare const walletContext: React.Context<{
    walletManager: WalletManager;
}>;
export declare const WalletProvider: ({ chains, wallets, walletModal, signerOptions, viewOptions, endpointOptions, storageOptions, children, }: {
    chains: Chain[];
    wallets: WalletOption[];
    walletModal?: ({ isOpen, setOpen, }: WalletModalProps) => JSX.Element;
    signerOptions?: SignerOptions;
    viewOptions?: ViewOptions;
    endpointOptions?: EndpointOptions;
    storageOptions?: StorageOptions;
    children: ReactNode;
}) => JSX.Element;
