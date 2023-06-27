import { C as ChainWalletBase } from '../chain-932d9904.js';
import { Dispatch } from './common.js';
import { WalletRepo } from '../repository.js';
import '@chain-registry/types';
import '@cosmjs/cosmwasm-stargate';
import '@cosmjs/stargate';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';
import '../utils/logger.js';
import 'events';

declare enum ModalView {
    WalletList = "WalletList",
    Connecting = "Connecting",
    Connected = "Connected",
    Error = "Error",
    NotExist = "NotExist",
    Rejected = "Rejected",
    QRCode = "QRCode"
}
interface WalletModalProps {
    isOpen: boolean;
    setOpen: Dispatch<boolean>;
    walletRepo?: WalletRepo;
}
interface WalletViewProps {
    onClose: () => void;
    onReturn: () => void;
    wallet: ChainWalletBase;
}
interface RefObject<T> {
    readonly current: T | null;
}
interface WalletListViewProps {
    onClose: () => void;
    wallets: ChainWalletBase[];
    initialFocus?: RefObject<HTMLButtonElement>;
}
declare type SingleWalletView = `${Exclude<ModalView, ModalView.WalletList>}`;
declare type ModalViews = {
    [p in SingleWalletView]?: (props: WalletViewProps) => JSX.Element;
} & {
    WalletList?: (props: WalletListViewProps) => JSX.Element;
};

export { ModalView, ModalViews, WalletListViewProps, WalletModalProps, WalletViewProps };
