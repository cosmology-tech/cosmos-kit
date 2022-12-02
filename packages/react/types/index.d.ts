/// <reference types="react" />
export * from './hooks';
export * from './modal/get-modal';
export * from './modal/theme';
export * from './provider';
export * from './provider-v2';
export declare const DefaultModal: ({ isOpen, setOpen }: import("@cosmos-kit/core").WalletModalProps) => JSX.Element;
export declare const DefaultModalV2: ({ isOpen, setOpen, walletRepo, theme }: import("@cosmos-kit/core").WalletModalPropsV2) => JSX.Element;
