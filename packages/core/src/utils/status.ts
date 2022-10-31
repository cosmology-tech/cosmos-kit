import { State, WalletStatus } from '../types';
import { ClientNotExistError, RejectedError } from './error';

export const getWalletStatusFromState = (
  state: State,
  message?: string
): WalletStatus => {
  switch (state) {
    case State.Pending:
      return WalletStatus.Connecting;
    case State.Done:
      return WalletStatus.Connected;
    case State.Error:
      switch (message) {
        case ClientNotExistError.message:
          return WalletStatus.NotExist;
        case RejectedError.message:
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
