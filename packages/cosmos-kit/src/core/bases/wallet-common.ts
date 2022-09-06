import { Dispatch, Mutable, State } from '../types'

export abstract class WalletCommonBase<D> {
  protected _mutable: Mutable<D>

  constructor() {
    this._mutable = { state: State.Init }
  }

  get mutable() {
    return this._mutable
  }

  get state() {
    return this.mutable.state
  }

  get data() {
    return this.mutable.data
  }

  get isInit() {
    return this.state === State.Init
  }

  get isNotInit() {
    return !this.isInit
  }

  get isReady() {
    return this.state === State.Done
  }

  get isFailed() {
    return this.state === State.Error
  }

  get isLoading() {
    return this.state === State.Pending
  }

  setState(state: State, emitState?: Dispatch<State>) {
    this._mutable.state = state
    if (emitState) {
      emitState(state)
    }
  }

  setData(data: D | undefined, emitData?: Dispatch<D | undefined>) {
    this._mutable.data = data
    if (emitData) {
      emitData(data)
    }
  }

  clear(emitState?: Dispatch<State>, emitData?: Dispatch<D | undefined>) {
    this.setData(undefined, emitData)
    this.setState(State.Init, emitState)
  }

  connect(emitState?: Dispatch<State>, emitData?: Dispatch<D | undefined>) {
    this.update(emitState, emitData)
  }

  abstract update(
    emitState?: Dispatch<State>,
    emitData?: Dispatch<D | undefined>
  ): void
  abstract disconnect(
    emitState?: Dispatch<State>,
    emitData?: Dispatch<D | undefined>
  ): void
}
