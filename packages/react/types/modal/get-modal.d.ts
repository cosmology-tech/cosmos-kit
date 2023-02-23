import { Logger, ModalViews, WalletModalProps } from '@cosmos-kit/core';
export declare function getWrappedWalletModal(theme?: Record<string, any>, modalViews?: ModalViews, resetCSS?: boolean, logger?: Logger): ({ isOpen, setOpen, walletRepo }: WalletModalProps) => JSX.Element;
