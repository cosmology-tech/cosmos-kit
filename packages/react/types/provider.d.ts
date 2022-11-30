import { AssetList, Chain } from '@chain-registry/types';
import { EndpointOptions, MainWalletBase, ModalVersion, SessionOptions, SignerOptions, StorageOptions, ViewOptions } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import { ReactNode } from 'react';
export declare const walletContext: any;
export declare const WalletProvider: ({ chains, assetLists, wallets, walletModal, signerOptions, viewOptions, endpointOptions, storageOptions, sessionOptions, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: ModalVersion | (({ isOpen, setOpen }: WalletModalProps) => JSX.Element);
    signerOptions?: SignerOptions;
    viewOptions?: ViewOptions;
    endpointOptions?: EndpointOptions;
    storageOptions?: StorageOptions;
    sessionOptions?: SessionOptions;
    children: ReactNode;
}) => JSX.Element;
