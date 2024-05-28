import { State, WalletStatus } from '../../src/types';
import { ClientNotExistError, getWalletStatusFromState, RejectedError } from "../../src/utils";

describe('getWalletStatusFromState', () => {
  it('should return Connecting when state is Pending', () => {
    const state = State.Pending
    const walletStatus = getWalletStatusFromState(state);
    expect(walletStatus).toBe(WalletStatus.Connecting);
  });

  it('should return Connected when state is Done', () => {
    const state = State.Done
    const walletStatus = getWalletStatusFromState(state);
    expect(walletStatus).toBe(WalletStatus.Connected);
  });

  it('should return NotExist when state is Error and message is ClientNotExistError', () => {
    const state = State.Error
    const message = ClientNotExistError.message;
    const walletStatus = getWalletStatusFromState(state, message);
    expect(walletStatus).toBe(WalletStatus.NotExist);
  });

  it('should return Rejected when state is Error and message is RejectedError', () => {
    const state = State.Error
    const message = RejectedError.message;
    const walletStatus = getWalletStatusFromState(state, message);
    expect(walletStatus).toBe(WalletStatus.Rejected);
  });

  it('should return Error when state is Error and message is not recognized', () => {
    const state = State.Error
    const message = 'Some other error message';
    const walletStatus = getWalletStatusFromState(state, message);
    expect(walletStatus).toBe(WalletStatus.Error);
  });

  it('should return Disconnected when state is Init', () => {
    const state = State.Init
    const walletStatus = getWalletStatusFromState(state);
    expect(walletStatus).toBe(WalletStatus.Disconnected);
  });

  it('should return Disconnected when state is unknown', () => {
    const state = 'UnknownState';
    const walletStatus = getWalletStatusFromState(state as State);
    expect(walletStatus).toBe(WalletStatus.Disconnected);
  });
});
