import { Dispatch, Mutable, State } from '../types';

interface StateActions<T> {
  state?: Dispatch<State>;
  data?: Dispatch<T | undefined>;
  message?: Dispatch<string | undefined>;
}

interface Actions<T> extends StateActions<T> {
  [k: string]: Dispatch<any> | undefined;
}

export abstract class WalletCommonBase<A, B> {
  protected _mutable: Mutable<B>;
  actions?: Actions<B>;

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

  get data() {
    return this.mutable.data;
  }

  get message() {
    return this.mutable.message;
  }

  get isInit() {
    return this.state === State.Init;
  }

  get isNotInit() {
    return !this.isInit;
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

  setState(state: State) {
    this._mutable.state = state;
    this.emitState?.(state);
  }

  setData(data: B | undefined) {
    this._mutable.data = data;
    this.emitData?.(data);
  }

  setMessage(message: string) {
    this._mutable.message = message;
    this.emitMessage?.(message);
  }

  clear() {
    this.setData(undefined);
    this.setState(State.Init);
  }

  async connect() {
    if (!await this.client) {
      this.setState(State.Error);
      this.setMessage("Client Not Exist!");
      return
    }
    this.update();
  }

  abstract get client(): Promise<A> | undefined | A;
  abstract update(): void;
  abstract disconnect(): void;
}
