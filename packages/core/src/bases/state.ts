import { Actions, DappEnv, Data, Mutable, State, StateActions, WalletStatus } from '../types';
import { getWalletStatusFromState } from '../utils';
import type { Logger } from '../utils';

export class StateBase {
  protected _mutable: Mutable<Data>;
  actions?: StateActions<Data>;
  protected _env?: DappEnv;
  logger?: Logger;

  constructor() {
    this._mutable = { state: State.Init };
  }

  get env() {
    return this._env;
  }

  setEnv(env?: DappEnv) {
    this._env = env;
  }

  setActions = (actions: Actions) => {
    this.actions = actions;
  };

  get isMobile() {
    return this.env?.device === 'mobile';
  }

  get mutable() {
    return this._mutable;
  }

  get state() {
    return this.mutable.state;
  }

  get isInit() {
    return this.state === 'Init';
  }

  get isDone() {
    return this.state === 'Done';
  }

  get isError() {
    return this.state === 'Error';
  }

  get isPending() {
    return this.state === 'Pending';
  }

  get data() {
    return this.mutable.data;
  }

  get message() {
    return this.mutable.message;
  }

  setState(state: State) {
    this.logger?.debug(
      `[State Change] ${this.state} (${
        (this as any).walletStatus
      }) -> ${state} (${(this as any).chainName}/${(this as any).walletName})`
    );
    this._mutable.state = state;
    this.actions?.state?.(state);
  }

  setData(data: Data | undefined) {
    this._mutable.data = data;
    this.actions?.data?.(data);
  }

  setMessage(message: string | undefined) {
    this.logger?.debug(
      `[Message Set] ${message} (${(this as any).chainName}/${
        (this as any).walletName
      })`
    );
    this._mutable.message = message;
    this.actions?.message?.(message);
  }

  reset() {
    this.setData(undefined);
    this.setMessage(undefined);
    this.setState(State.Init);
  }

  get walletStatus(): WalletStatus {
    return getWalletStatusFromState(this.state, this.message);
  }

  get isWalletOnceConnect() {
    return this.isWalletConnected || this.isWalletError;
  }

  get isWalletConnecting() {
    return this.walletStatus === 'Connecting';
  }

  get isWalletConnected() {
    return this.walletStatus === 'Connected';
  }

  get isWalletDisconnected() {
    return this.walletStatus === 'Disconnected';
  }

  get isWalletRejected() {
    return this.walletStatus === 'Rejected';
  }

  get isWalletNotExist() {
    return this.walletStatus === 'NotExist';
  }

  get isWalletError() {
    return this.walletStatus === 'Error';
  }
}
