import { ModalViews, WalletModalProps } from '@cosmos-kit/core';
export declare const DefaultModal: ({ isOpen, setOpen, walletRepo, }: WalletModalProps) => JSX.Element;
export declare const WalletModal: ({ isOpen, setOpen, walletRepo, modalViews, }: WalletModalProps & {
    modalViews: ModalViews;
}) => JSX.Element;
