import { WalletViewProps, WalletListViewProps, ModalViews } from '@cosmos-kit/core';

declare const ConnectedView: ({ onClose, onReturn, wallet, }: WalletViewProps) => JSX.Element;

declare const ConnectingView: ({ onClose, onReturn, wallet, }: WalletViewProps) => JSX.Element;

declare const ErrorView: ({ onClose, onReturn, wallet }: WalletViewProps) => JSX.Element;

declare const NotExistView: ({ onClose, onReturn, wallet, }: WalletViewProps) => JSX.Element;

declare const QRCodeView: ({ onClose, onReturn, wallet }: WalletViewProps) => JSX.Element;

declare const WalletListView: ({ onClose, wallets, initialFocus, }: WalletListViewProps) => JSX.Element;

declare const RejectedView: ({ onClose, onReturn, wallet, }: WalletViewProps) => JSX.Element;

declare const defaultModalViews: ModalViews;

export { ConnectedView, ConnectingView, ErrorView, NotExistView, QRCodeView, RejectedView, WalletListView, defaultModalViews };
