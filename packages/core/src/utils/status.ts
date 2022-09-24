import { State, WalletStatus } from '../types';

export const getWalletStatusFromState = (
  state?: State,
  message?: string
): WalletStatus => {
  switch (state) {
    case State.Pending:
      return WalletStatus.Connecting;
    case State.Done:
      return WalletStatus.Connected;
    case State.Error:
      switch (message) {
        case 'Client Not Exist!':
          return WalletStatus.NotExist;
        case 'Request rejected':
          return WalletStatus.Rejected;
        default:
          return WalletStatus.Error;
      }
    case State.Init:
      return WalletStatus.Disconnected;
    default:
      return WalletStatus.Disconnected;
  }
};
