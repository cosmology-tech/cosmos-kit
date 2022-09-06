import { Keplr } from '@keplr-wallet/types'

import { MainWalletBase } from '../../core/bases'
import { ChainName, Dispatch, State } from '../../core/types'
import { ChainKeplr } from './chain'
import { KeplrData } from './types'
import { getKeplrFromExtension } from './utils'

export class KeplrWallet extends MainWalletBase<Keplr, ChainKeplr> {
  protected _chains!: Map<ChainName, ChainKeplr>

  constructor(_concurrency?: number) {
    super(_concurrency)
  }

  get client(): Promise<Keplr | undefined> {
    return (async () => {
      return await getKeplrFromExtension()
    })()
  }

  setChains(supportedChains: ChainName[]): void {
    this._chains = new Map(
      supportedChains.map((chainName) => [
        chainName,
        new ChainKeplr(chainName, this),
      ])
    )
  }

  async update(
    emitState?: Dispatch<State>,
    emitData?: Dispatch<KeplrData | undefined>
  ) {
    this.setState(State.Pending, emitState)
    for (const chainName of this.chainNames) {
      try {
        const chainWallet = this.chains.get(chainName)!
        await chainWallet.update()
        this.setData(
          {
            username: chainWallet.username!,
          },
          emitData
        )
        this.setState(State.Done, emitState)
        return
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    throw new Error(`Fail to update any chain.`)
  }
}

export * from './chain'
