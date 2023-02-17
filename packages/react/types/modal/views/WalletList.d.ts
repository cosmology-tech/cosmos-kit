/// <reference types="react" />
import { ChainWalletBase } from '@cosmos-kit/core';
export declare const WalletList: ({ onClose, onWalletClicked, wallets, }: {
    onClose: () => void;
    onWalletClicked: (name: string) => void;
    wallets: ChainWalletBase[];
}) => JSX.Element;
