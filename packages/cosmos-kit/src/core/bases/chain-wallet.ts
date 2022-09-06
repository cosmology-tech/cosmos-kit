import { ChainName, ChainWalletData, Dispatch, State } from '../types'
import { WalletCommonBase } from './wallet-common'

export abstract class ChainWalletBase<
  T extends ChainWalletData,
  MainWallet
> extends WalletCommonBase<T> {
  constructor(
    protected _chainName: ChainName,
    protected mainWallet?: MainWallet
  ) {
    super()
  }

  get chainName() {
    return this._chainName
  }

  get address(): string | undefined {
    return this.data?.address
  }

  disconnect(emitState?: Dispatch<State>, emitData?: Dispatch<T | undefined>) {
    this.clear(emitState, emitData)
  }
}
