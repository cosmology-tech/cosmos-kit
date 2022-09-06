import { ChainWalletBase } from '../../core/bases'
import { ChainName, Dispatch, State } from '../../core/types'
import { KeplrWallet } from '.'
import { ChainKeplrData } from './types'

export class ChainKeplr extends ChainWalletBase<ChainKeplrData, KeplrWallet> {
  constructor(
    protected _chainName: ChainName,
    protected keplrWallet: KeplrWallet
  ) {
    super(_chainName, keplrWallet)
  }

  get client() {
    return (async () => {
      const client = await this.keplrWallet.client
      if (!client) {
        throw new Error('No Keplr installed!')
      }
      return client
    })()
  }

  get username(): string | undefined {
    return this.data?.username
  }

  async update(
    emitState?: Dispatch<State>,
    emitData?: Dispatch<ChainKeplrData | undefined>
  ) {
    this.setState(State.Pending, emitState)
    try {
      const key = await (await this.client).getKey(this.chainName)
      this.setData(
        {
          address: key.bech32Address,
          username: key.name,
        },
        emitData
      )
      this.setState(State.Done, emitState)
    } catch (e) {
      this.setState(State.Error, emitState)
      console.info(`Fail to update chain ${this.chainName}.`)
      throw e
    }
  }
}
