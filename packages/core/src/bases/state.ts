import { Mutable, State, StateActions, WalletStatus } from '../types';
import { getWalletStatusFromState } from '../utils';


export abstract class StateBase<T> {
  protected _mutable: Mutable<T>;
  actions?: StateActions<T>;

  constructor() {
    this._mutable = { state: State.Init };
  }

  get emitState() {
    return this.actions?.state;
  }

  get emitData() {
    return this.actions?.data;
  }

  get emitMessage() {
    return this.actions?.message;
  }

  get mutable() {
    return this._mutable;
  }

  get state() {
    return this.mutable.state;
  }

  get isInit() {
    return this.state === State.Init;
  }

  get isDone() {
    return this.state === State.Done;
  }

  get isError() {
    return this.state === State.Error;
  }

  get isPending() {
    return this.state === State.Pending;
  }

  get data() {
    return this.mutable.data;
  }

  get message() {
    return this.mutable.message;
  }

  setState(state: State, emit: boolean = true) {
    this._mutable.state = state;
    if (emit) {
      console.log(123, state, this.emitState)
      this.emitState?.(state);
    };
  }

  setData(data: T | undefined, emit: boolean = true) {
    this._mutable.data = data;
    if (emit) this.emitData?.(data);
  }

  setMessage(message: string, emit: boolean = true) {
    this._mutable.message = message;
    if (emit) this.emitMessage?.(message);
  }

  reset(emit: boolean = true) {
    this.setData(undefined, emit);
    this.setMessage(undefined, emit);
    this.setState(State.Init, emit);
  }

  get walletStatus() {
    return getWalletStatusFromState(this.state, this.message);
  }

  get isWalletConnected() {
    return this.walletStatus === WalletStatus.Connected;
  }

  get isWalletDisconnected() {
    return this.walletStatus === WalletStatus.Disconnected;
  }

  get isWalletRejected() {
    return this.walletStatus === WalletStatus.Rejected;
  }

  get isWalletNotExist() {
    return this.walletStatus === WalletStatus.NotExist;
  }

  get isWalletError() {
    return this.walletStatus === WalletStatus.Error;
  }

  abstract update(emit?: boolean): void | Promise<void>;
}
