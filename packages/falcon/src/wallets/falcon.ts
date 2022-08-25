import { Wallet } from '@cosmos-kit/types'
import { Falcon } from '@falcon-wallet/falconjs/dist/types'

import imageUrl from './images/falcon-extension.png'

declare global {
  interface Window {
    falcon: Falcon
  }
}

export const FalconWallet: Wallet<Falcon> = {
  id: 'falcon',
  name: 'Falcon Wallet',
  description: 'Falcon Chrome Extension',
  imageUrl,
  isWalletConnect: false,
  getClient: async () => {
    if (window.falcon) {
      return window.falcon
    }
  },
  getOfflineSignerFunction: (client) =>
    client.getOfflineSignerAuto.bind(client),
  enableClient: async (client) => {
    return await client.connect()
  },
  getNameAddress: (client, chainInfo) =>
    client.getKey(chainInfo.chainId).then((key) => ({
      name: key.name,
      address: key.address,
    })),
  shouldAutoconnect: async () => false,
  addRefreshListener: (listener) =>
    window.addEventListener('falcon_keystorechange', listener),
  removeRefreshListener: (listener) =>
    window.removeEventListener('falcon_keystorechange', listener),
}
