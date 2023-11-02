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

export type WalletViewImplGetter = (props: WalletViewProps) => ModalViewImpl;

export type WalletListImplGetter = (
  props: WalletListViewProps
) => ModalViewImpl;

export const defaultModalViews: Record<
  keyof ModalViews,
  WalletViewImplGetter | WalletListImplGetter
> = {
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
    logo: typeof logo === 'object' ? logo.major : logo,
    mobileDisabled:
      typeof mobileDisabled === 'boolean' ? mobileDisabled : mobileDisabled(),
    isMobile: mode === 'wallet-connect',
  };
}
