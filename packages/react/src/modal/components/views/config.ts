import {
  ModalViews,
  Wallet,
  WalletListViewProps,
  WalletViewProps,
} from '@cosmos-kit/core';

import { ConnectedView } from './Connected';
import { ConnectingView } from './Connecting';
import { ErrorView } from './Error';
import { NotExistView } from './NotExist';
import { QRCodeView } from './QRCode';
import { RejectedView } from './Rejected';
import { WalletListView } from './WalletList';

export type ModalViewImpl = {
  head: React.ReactNode;
  content: React.ReactNode;
};

export type ModalViewImplGetter = (
  props: WalletViewProps | WalletListViewProps
) => ModalViewImpl;

export const defaultModalViews: Record<keyof ModalViews, ModalViewImplGetter> =
  {
    Connecting: ConnectingView,
    Connected: ConnectedView,
    Error: ErrorView,
    NotExist: NotExistView,
    Rejected: RejectedView,
    QRCode: QRCodeView,
    WalletList: WalletListView,
  };

export function getWalletProp(wallet: Wallet) {
  const { prettyName, mode, name, logo, mobileDisabled } = wallet;
  return {
    name,
    prettyName,
    logo,
    mobileDisabled,
    isMobile: mode === 'wallet-connect',
  };
}
