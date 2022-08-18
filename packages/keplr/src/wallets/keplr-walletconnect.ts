import { ChainRegistryInfo, Wallet, WalletAdapter } from '@cosmos-kit/types'
import { ChainInfo as KeplrChainInfo } from '@keplr-wallet/types'

import { getKeplrChainInfo } from '../chainInfo'
import { IKeplrWalletConnectV1 } from '../types'
import imageUrl from './images/keplr-walletconnect.png'

export class KeplrWalletConnectAdapter extends WalletAdapter {
  wallet: Wallet<IKeplrWalletConnectV1>
  keplrChainInfo: KeplrChainInfo

  constructor(chainName: string, info: ChainRegistryInfo) {
    super()
    this.wallet = KeplrWalletConnectWallet
    this.keplrChainInfo = getKeplrChainInfo(chainName, info)
  }

  getRestEndpoint(): string {
    return this.keplrChainInfo.rest
  }

  getRpcEndpoint(): string {
    return this.keplrChainInfo.rpc
  }

  async enableClient(client) {
    client.enable(this.keplrChainInfo.chainId)
  }
}

export const KeplrWalletConnectWallet: Wallet<IKeplrWalletConnectV1> = {
  // adapterClass: KeplrWalletConnectAdapter,
  id: 'keplr-walletconnect',
  name: 'WalletConnect',
  description: 'Keplr Mobile',
  imageUrl,
  isWalletConnect: true,
  walletConnectDeeplinkFormats: {
    ios: 'keplrwallet://wcV1?{{uri}}',
    android:
      'intent://wcV1?{{uri}}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
  },
  walletConnectSigningMethods: [
    'keplr_enable_wallet_connect_v1',
    'keplr_sign_amino_wallet_connect_v1',
  ],
  getAdapter: (chainName: string, info: ChainRegistryInfo) => {
    return new KeplrWalletConnectAdapter(chainName, info)
  },
  getClient: async (
    chainName: string,
    chainInfo: ChainRegistryInfo,
    walletConnect,
    newWalletConnectSession
  ) => {
    if (walletConnect?.connected) {
      const keplrChainInfo = getKeplrChainInfo(chainName, chainInfo)
      const client = new (
        await import('../connectors/keplr-walletconnect')
      ).KeplrWalletConnectV1(walletConnect, [keplrChainInfo])
      // Prevent double app open request. See comment in
      // `keplr-walletconnect.ts` for more details.
      client.dontOpenAppOnEnable = !!newWalletConnectSession
      return client
    }
    throw new Error('Mobile wallet not connected.')
  },
  cleanupClient: async (client) => {
    // Allow future enable requests to open the app. See comment in
    // `keplr-walletconnect.ts` for more details.
    client.dontOpenAppOnEnable = false
  },
  // WalletConnect only supports Amino signing.
  getOfflineSignerFunction: (client) =>
    // This function expects to be bound to the `client` instance.
    client.getOfflineSignerOnlyAmino.bind(client),
  getNameAddress: (client, chainInfo) =>
    client.getKey(chainInfo.chain.chain_id).then((key) => ({
      name: key.name,
      address: key.bech32Address,
    })),
  // Refresh listener controls.
  addRefreshListener: (listener) =>
    window.addEventListener('keplr_keystorechange', listener),
  removeRefreshListener: (listener) =>
    window.removeEventListener('keplr_keystorechange', listener),
}
