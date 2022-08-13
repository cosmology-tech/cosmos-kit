import { ReactNode } from 'react';
import { BaseModalProps } from './BaseModal';
export interface EnablingWalletModalProps extends BaseModalProps {
    renderLoader?: () => ReactNode;
    reset: () => void;
}
export declare const EnablingWalletModal: ({ isOpen, classNames, renderLoader, reset, ...props }: EnablingWalletModalProps) => JSX.Element;
