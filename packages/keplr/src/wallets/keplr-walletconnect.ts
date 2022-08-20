import { ChainRegistryInfo, WalletAdapter } from '@cosmos-kit/types'
import { ChainInfo as KeplrChainInfo } from '@keplr-wallet/types'

import { getKeplrChainInfo } from '../chainInfo'
import { IKeplrWalletConnectV1 } from '../types'
import imageUrl from './images/keplr-walletconnect.png'

export class KeplrWalletConnectAdapter
  implements WalletAdapter<IKeplrWalletConnectV1>
{
  static id = 'keplr-walletconnect'
  static displayName = 'WalletConnect'
  static description = 'Keplr Mobile'
  static logoUrl: string = imageUrl
  static isWalletConnect = true
  static walletConnectDeeplinkFormats = {
    ios: 'keplrwallet://wcV1?{{uri}}',
    android:
      'intent://wcV1?{{uri}}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
  }
  static walletConnectSigningMethods = [
    'keplr_enable_wallet_connect_v1',
    'keplr_sign_amino_wallet_connect_v1',
  ]

  static getClient = async (
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
  }

  // Refresh listener controls.
  static addRefreshListener = (listener) =>
    window.addEventListener('keplr_keystorechange', listener)

  static removeRefreshListener = (listener) =>
    window.removeEventListener('keplr_keystorechange', listener)

  client: IKeplrWalletConnectV1
  keplrChainInfo: KeplrChainInfo

  constructor(
    client: IKeplrWalletConnectV1,
    chainName: string,
    info: ChainRegistryInfo
  ) {
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
    await this.client.enable(this.keplrChainInfo.chainId)
  }

  async cleanupClient() {
    // Allow future enable requests to open the app. See comment in
    // `keplr-walletconnect.ts` for more details.
    this.client.dontOpenAppOnEnable = false
  }

  getOfflineSigner() {
    // WalletConnect only supports Amino signing.
    // This function expects to be bound to the `client` instance.
    return this.client.getOfflineSignerOnlyAmino.bind(this.client)(
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
