/// <reference types="react" />
import { ConnectModalContentType, DisplayWalletListType, DownloadWalletButtonType } from './types';
export declare const SimpleInstallWalletButton: ({ icon, text, onClick, disabled, }: DownloadWalletButtonType) => JSX.Element;
export declare const SimpleDisplayModalContent: ({ status, logo, contentHeader, contentDesc, username, walletIcon, addressButton, bottomButton, }: ConnectModalContentType) => JSX.Element;
export declare const SimpleQRCode: ({ link, description, }: {
    link: string;
    description?: string;
}) => JSX.Element;
export declare const SimpleDisplayWalletList: ({ initialFocus, walletsData, }: DisplayWalletListType) => JSX.Element;
