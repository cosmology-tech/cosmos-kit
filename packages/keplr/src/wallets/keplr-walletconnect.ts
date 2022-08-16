import { Wallet } from '@cosmos-kit/types'

import { IKeplrWalletConnectV1 } from '../types'
import imageUrl from './images/keplr-walletconnect.png'

export const KeplrWalletConnectWallet: Wallet<IKeplrWalletConnectV1> = {
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
  getClient: async (chainInfo, walletConnect, newWalletConnectSession) => {
    if (walletConnect?.connected) {
      const client = new (
        await import('../connectors/keplr-walletconnect')
      ).KeplrWalletConnectV1(walletConnect, [chainInfo])
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
  enableClient: (client, chainInfo) => client.enable(chainInfo.chainId),
  getNameAddress: (client, chainInfo) =>
    client.getKey(chainInfo.chainId).then((key) => ({
      name: key.name,
      address: key.bech32Address,
    })),
  // Refresh listener controls.
  addRefreshListener: (listener) =>
    window.addEventListener('keplr_keystorechange', listener),
  removeRefreshListener: (listener) =>
    window.removeEventListener('keplr_keystorechange', listener),
}
