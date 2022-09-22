import { SignerOptions, ViewOptions, WalletManager, Wallet, EndpointOptions } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { ReactNode } from 'react';
import { Chain } from '@chain-registry/types';
export declare const walletContext: React.Context<{
    walletManager: WalletManager;
}>;
export declare const WalletProvider: ({ chains, wallets, walletModal, signerOptions, viewOptions, endpointOptions, children, }: {
    chains: Chain[];
    wallets: Wallet[];
    walletModal?: ({ isOpen, setOpen, }: WalletModalProps) => JSX.Element;
    signerOptions?: SignerOptions;
    viewOptions?: ViewOptions;
    endpointOptions?: EndpointOptions;
    children: ReactNode;
}) => JSX.Element;
