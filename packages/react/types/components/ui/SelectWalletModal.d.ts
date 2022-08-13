/// <reference types="react" />
import { Wallet } from '@cosmos-wallet/types';
import { BaseModalProps } from './BaseModal';
export interface SelectWalletModalProps extends BaseModalProps {
    wallets: Wallet[];
    selectWallet: (wallet: Wallet) => void;
}
export declare const SelectWalletModal: ({ wallets, selectWallet, classNames, ...props }: SelectWalletModalProps) => JSX.Element;
