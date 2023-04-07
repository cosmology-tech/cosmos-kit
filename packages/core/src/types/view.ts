import { ChainWallet } from '../bases';
import { WalletRepo } from '../repository';
import { Dispatch } from './common';
import { DownloadInfo, Wallet, WalletClient } from './wallet';

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
  walletRepos: WalletRepo[];
}

export interface WalletViewProps {
  onClose: () => void;
  onReturn: () => void;
  walletInfo: Wallet;
  message?: string;
}

export interface ConnectedWalletViewProps extends WalletViewProps {
  wallets: ChainWallet[];
}

export interface RejectedWalletViewProps extends WalletViewProps {
  wallets: ChainWallet[];
}

export interface NotExistWalletViewProps extends WalletViewProps {
  downloadInfo?: DownloadInfo;
}

export interface QRCodeWalletViewProps extends WalletViewProps {
  walletClient: WalletClient;
  chainIds?: string[];
}

interface RefObject<T> {
  readonly current: T | null;
}

export interface WalletListViewProps {
  onClose: () => void;
  repos: WalletRepo[];
  includeAllWalletsOnMobile?: boolean;
  initialFocus?: RefObject<HTMLButtonElement>;
}

export type ModalViews = {
  WalletList?: (props: WalletListViewProps) => JSX.Element;
  Connecting?: (props: WalletViewProps) => JSX.Element;
  Connected?: (props: ConnectedWalletViewProps) => JSX.Element;
  Error?: (props: WalletViewProps) => JSX.Element;
  NotExist?: (props: NotExistWalletViewProps) => JSX.Element;
  Rejected?: (props: RejectedWalletViewProps) => JSX.Element;
  QRCode?: (props: QRCodeWalletViewProps) => JSX.Element;
};
