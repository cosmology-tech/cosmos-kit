/// <reference types="react" />
import { ChainWalletBase } from '../bases';
import { WalletRepo } from '../repository';
import { Dispatch } from './common';
export declare enum ModalView {
    WalletList = "WalletList",
    Connecting = "Connecting",
    Connected = "Connected",
    Error = "Error",
    NotExist = "NotExist",
    Rejected = "Rejected",
    QRCode = "QRCode"
}
export interface WalletModalProps {
    isOpen: boolean;
    setOpen: Dispatch<boolean>;
    walletRepo?: WalletRepo;
}
export interface WalletViewProps {
    onClose: () => void;
    onReturn: () => void;
    wallet: ChainWalletBase;
}
interface RefObject<T> {
    readonly current: T | null;
}
export interface WalletListViewProps {
    onClose: () => void;
    wallets: ChainWalletBase[];
    initialFocus?: RefObject<HTMLButtonElement>;
}
declare type SingleWalletView = `${Exclude<ModalView, ModalView.WalletList>}`;
export declare type ModalViews = {
    [p in SingleWalletView]?: (props: WalletViewProps) => JSX.Element;
} & {
    WalletList?: (props: WalletListViewProps) => JSX.Element;
};
export {};
