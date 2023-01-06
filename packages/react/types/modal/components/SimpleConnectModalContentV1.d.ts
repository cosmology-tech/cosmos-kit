/// <reference types="react" />
import { ConnectModalContentType, DisplayWalletListType, DownloadWalletButtonType } from './types';
export declare const SimpleInstallWalletButtonV1: ({ icon, text, disabled, onClick, }: DownloadWalletButtonType) => JSX.Element;
export declare const SimpleDisplayModalContentV1: ({ status, logo, contentHeader, contentDesc, username, walletIcon, addressButton, bottomButton, }: ConnectModalContentType) => JSX.Element;
export declare const SimpleQRCodeV1: ({ link, description, }: {
    link: string;
    description?: string;
}) => JSX.Element;
export declare const SimpleDisplayWalletListV1: ({ initialFocus, walletsData, }: DisplayWalletListType) => JSX.Element;
