import { ChainWalletBase } from '../bases';
import { WalletRepo } from '../repository';
import { Dispatch } from './common';

export enum ModalView {
  WalletList = 'WalletList',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Error = 'Error',
  NotExist = 'NotExist',
  Rejected = 'Rejected',
  QRCode = 'QRCode',
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

export interface WalletListViewProps {
  onClose: () => void;
  wallets: ChainWalletBase[];
}

type SingleWalletView = `${Exclude<ModalView, ModalView.WalletList>}`;

export type ModalViews = {
    [p in SingleWalletView]?: (props: WalletViewProps) => JSX.Element;
} & {
    WalletList?: (props: WalletListViewProps) => JSX.Element;
};
