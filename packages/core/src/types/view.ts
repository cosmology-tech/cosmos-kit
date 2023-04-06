import { ChainWallet, MainWallet } from '../bases';
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
  mainWallets: MainWallet[];
}

export interface WalletViewProps {
  onClose: () => void;
  onReturn: () => void;
  wallet: ChainWallet;
}

interface RefObject<T> {
  readonly current: T | null;
}

export interface WalletListViewProps {
  onClose: () => void;
  wallets: ChainWallet[];
  initialFocus?: RefObject<HTMLButtonElement>;
}

type SingleWalletView = `${Exclude<ModalView, ModalView.WalletList>}`;

export type ModalViews = {
  [p in SingleWalletView]?: (props: WalletViewProps) => JSX.Element;
} & {
  WalletList?: (props: WalletListViewProps) => JSX.Element;
};
