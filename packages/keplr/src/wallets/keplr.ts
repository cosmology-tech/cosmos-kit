import { ChainRegistryInfo, Wallet, WalletAdapter } from '@cosmos-kit/types'
import { ChainInfo as KeplrChainInfo, Keplr } from '@keplr-wallet/types'

import { getKeplrChainInfo } from '../chainInfo'
import imageUrl from './images/keplr-extension.png'

export class KeplrWalletAdapter extends WalletAdapter {
  wallet: Wallet<Keplr>
  keplrChainInfo: KeplrChainInfo

  constructor(chainName: string, info: ChainRegistryInfo) {
    super()
    this.wallet = KeplrWallet
    this.keplrChainInfo = getKeplrChainInfo(chainName, info)
  }

  getRestEndpoint(): string {
    return this.keplrChainInfo.rest
  }

  getRpcEndpoint(): string {
    return this.keplrChainInfo.rpc
  }
}

export const KeplrWallet: Wallet<Keplr> = {
  adapterClass: KeplrWalletAdapter,
  id: 'keplr',
  name: 'Keplr Wallet',
  description: 'Keplr Chrome Extension',
  imageUrl,
  isWalletConnect: false,
  getClient: async () =>
    (await import('@keplr-wallet/stores')).getKeplrFromWindow(),
  getOfflineSignerFunction: (client) =>
    // This function expects to be bound to the `client` instance.
    client.getOfflineSignerAuto.bind(client),
  enableClient: async (client, chainInfo) => {
    // Only Keplr browser extension supports suggesting chain.
    if (client.mode === 'extension') {
      await client.experimentalSuggestChain(chainInfo)
    }
    return await client.enable(chainInfo.chainId)
  },
  getNameAddress: (client, chainInfo) =>
    client.getKey(chainInfo.chainId).then((key) => ({
      name: key.name,
      address: key.bech32Address,
    })),
  // Autoconnect to this wallet if in Keplr's in-app browser interface, since
  // the Keplr client is already provided/connected.
  shouldAutoconnect: async () =>
    import('@keplr-wallet/stores')
      .then(({ getKeplrFromWindow }) => getKeplrFromWindow())
      .then((keplr) => !!keplr && keplr.mode === 'mobile-web')
      .catch(() => false),
  // Refresh listener controls.
  addRefreshListener: (listener) =>
    window.addEventListener('keplr_keystorechange', listener),
  removeRefreshListener: (listener) =>
    window.removeEventListener('keplr_keystorechange', listener),
}
