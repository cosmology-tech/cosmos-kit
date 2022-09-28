/// <reference types="react" />
import { WalletModalType, DisplayWalletListType, ConnectModalContentType, DownloadWalletButtonType, ConnectWalletCardType } from "../types";
export declare const ConnectedContent: ({ userInfo, addressBtn, connectWalletButton, }: ConnectWalletCardType) => JSX.Element;
export declare const InstallWalletButton: ({ icon, text, }: DownloadWalletButtonType) => JSX.Element;
export declare const ExtensionContent: ({ selectedWallet, stateHeader, stateDesc, downloadWalletButton, connectWalletButton, isLoading, isReconnect, isWarning, }: ConnectModalContentType) => JSX.Element;
export declare const QRCode: ({ link }: {
    link: string;
}) => JSX.Element;
export declare const DisplayWalletList: ({ walletsData, onClick, }: DisplayWalletListType) => JSX.Element;
export declare const ModalHead: ({ title, backButton, onClose, onBack, }: {
    title: string;
    backButton: boolean;
    onClose: () => void;
    onBack?: () => void;
}) => JSX.Element;
export declare const ConnectModal: ({ modalHead, modalContent, modalIsOpen, modalOnClose, }: WalletModalType) => JSX.Element;
