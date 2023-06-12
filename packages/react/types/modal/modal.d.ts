/// <reference types="react" />
import { ModalViews, WalletModalProps } from '@cosmos-kit/core';
export declare const DefaultModal: ({ isOpen, setOpen, walletRepo, }: WalletModalProps) => JSX.Element;
export declare const WalletModal: ({ isOpen, setOpen, walletRepo, modalViews, includeAllWalletsOnMobile, }: WalletModalProps & {
    modalViews: ModalViews;
    includeAllWalletsOnMobile?: boolean;
}) => JSX.Element;
