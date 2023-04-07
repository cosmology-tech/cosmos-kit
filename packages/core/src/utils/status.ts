import { ChainWallet } from '../bases';
import { State, WalletStatus } from '../types';
import { ClientNotExistError, RejectedError } from './error';

export const getWalletStatusFromState = (
  state: State,
  message?: string
): WalletStatus => {
  switch (state) {
    case 'Pending':
      return WalletStatus.Connecting;
    case 'Done':
      return WalletStatus.Connected;
    case 'Error':
      switch (message) {
        case ClientNotExistError.message:
          return WalletStatus.NotExist;
        case RejectedError.message:
          return WalletStatus.Rejected;
        default:
          return WalletStatus.Error;
      }
    case 'Init':
      return WalletStatus.Disconnected;
    default:
      return WalletStatus.Disconnected;
  }
};

export const getGlobalStatusAndMessage = (
  chainWalletList: ChainWallet[]
): [WalletStatus, string | undefined] => {
  let wallet = chainWalletList.find((w) => w.isWalletNotExist);
  if (wallet) return [wallet.walletStatus, wallet.message];

  wallet = chainWalletList.find((w) => w.isWalletConnecting);
  if (wallet) return [WalletStatus.Connecting, void 0];

  wallet = chainWalletList.find((w) => w.isWalletDisconnected);
  if (wallet) {
    return [WalletStatus.Disconnected, 'Exist disconnected wallets'];
  }

  wallet = chainWalletList.find((w) => w.isError || w.isWalletRejected);
  if (wallet) return [wallet.walletStatus, wallet.message];

  return [WalletStatus.Connected, void 0];
};
