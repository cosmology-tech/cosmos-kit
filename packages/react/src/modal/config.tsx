import { ModalViews } from '@cosmos-kit/core';
import {
  ConnectedView,
  ConnectingView,
  QRCodeView,
  RejectedView,
  WalletListView,
  ErrorView,
  NotExistView,
} from './components/views';

export const defaultModalViews: ModalViews = {
  Connecting: ConnectingView,
  Connected: ConnectedView,
  Error: ErrorView,
  NotExist: NotExistView,
  Rejected: RejectedView,
  QRCode: QRCodeView,
  WalletList: WalletListView,
};
