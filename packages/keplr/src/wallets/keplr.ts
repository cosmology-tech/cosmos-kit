import { ChainRegistryInfo, WalletAdapter } from '@cosmos-kit/types'
import { ChainInfo as KeplrChainInfo, Keplr } from '@keplr-wallet/types'

import { getKeplrChainInfo } from '../chainInfo'
import imageUrl from './images/keplr-extension.png'

export class KeplrWalletAdapter implements WalletAdapter<Keplr> {
  static id = 'keplr'
  static displayName = 'Keplr Wallet'
  static description = 'Keplr Chrome Extension'
  static logoUrl: string = imageUrl
  static isWalletConnect = false

  static getClient = async () =>
    (await import('@keplr-wallet/stores')).getKeplrFromWindow()
  // Autoconnect to this wallet if in Keplr's in-app browser interface, since
  // the Keplr client is already provided/connected.
  static shouldAutoconnect = async () =>
    import('@keplr-wallet/stores')
      .then(({ getKeplrFromWindow }) => getKeplrFromWindow())
      .then((keplr) => !!keplr && keplr.mode === 'mobile-web')
      .catch(() => false)
  // Refresh listener controls.
  static addRefreshListener = (listener) =>
    window.addEventListener('keplr_keystorechange', listener)

  static removeRefreshListener = (listener) =>
    window.removeEventListener('keplr_keystorechange', listener)

  client: Keplr
  keplrChainInfo: KeplrChainInfo

  constructor(client: Keplr, chainName: string, info: ChainRegistryInfo) {
    this.client = client
    this.keplrChainInfo = getKeplrChainInfo(chainName, info)
  }

  getRestEndpoint(): string {
    return this.keplrChainInfo.rest
  }

  getRpcEndpoint(): string {
    return this.keplrChainInfo.rpc
  }

  async enableClient() {
    // Only Keplr browser extension supports suggesting chain.
    if (this.client.mode === 'extension') {
      await this.client.experimentalSuggestChain(this.keplrChainInfo)
    }
    return await this.client.enable(this.keplrChainInfo.chainId)
  }

  async cleanupClient(): Promise<void> {
    //
  }

  getOfflineSigner() {
    // This function expects to be bound to the `client` instance.
    return this.client.getOfflineSignerAuto.bind(this.client)(
      this.keplrChainInfo.chainId
    )
  }

  getNameAddress() {
    return this.client.getKey(this.keplrChainInfo.chainId).then((key) => ({
      name: key.name,
      address: key.bech32Address,
    }))
  }
}
