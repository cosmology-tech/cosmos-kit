import { Dispatch, Mutable, State } from '../types';

interface StateActions<D> {
  state?: Dispatch<State>;
  data?: Dispatch<D | undefined>;
}

interface Actions<D> extends StateActions<D> {
  [k: string]: Dispatch<any> | undefined;
}

export abstract class WalletCommonBase<D> {
  protected _mutable: Mutable<D>;
  actions?: Actions<D>;

  constructor() {
    this._mutable = { state: State.Init };
  }

  get emitState() {
    return this.actions?.state;
  }

  get emitData() {
    return this.actions?.data;
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

  get isInit() {
    return this.state === State.Init;
  }

  get isNotInit() {
    return !this.isInit;
  }

  get isReady() {
    return this.state === State.Done;
  }

  get isFailed() {
    return this.state === State.Error;
  }

  get isLoading() {
    return this.state === State.Pending;
  }

  setState(state: State) {
    this._mutable.state = state;
    this.emitState?.(state);
  }

  setData(data: D | undefined) {
    this._mutable.data = data;
    this.emitData?.(data);
  }

  clear() {
    this.setData(undefined);
    this.setState(State.Init);
  }

  connect() {
    this.update();
  }

  abstract update(): void;
  abstract disconnect(): void;
}
