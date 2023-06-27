import { WalletModalProps, ModalViews } from '@cosmos-kit/core';
export { addSemanticTokens, defaultTheme, noCssResetTheme } from './theme.js';

declare const DefaultModal: ({ isOpen, setOpen, walletRepo, }: WalletModalProps) => JSX.Element;
declare const WalletModal: ({ isOpen, setOpen, walletRepo, modalViews, includeAllWalletsOnMobile, }: WalletModalProps & {
    modalViews: ModalViews;
    includeAllWalletsOnMobile?: boolean;
}) => JSX.Element;

export { DefaultModal, WalletModal };
