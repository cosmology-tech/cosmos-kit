import { Keplr } from "@keplr-wallet/types"
import WalletConnect from "@walletconnect/client"

import { KeplrWalletConnectV1 } from "./connectors"

export type WalletClient = Keplr | KeplrWalletConnectV1

export interface Wallet {
  // A unique identifier among all wallets.
  id: string
  // The name of the wallet.
  name: string
  // A description of the wallet.
  description: string
  // The URL of the wallet logo.
  imageUrl: string
  // If this wallet client uses WalletConnect.
  isWalletConnect: boolean
  // A function that returns an instantiated wallet client, with walletConnect passed if `isWalletConnect` is true.
  getClient: (
    walletConnect?: WalletConnect
  ) => Promise<WalletClient | undefined>
  // A function whose response is awaited right after the wallet is picked. If this throws an error, the selection process is interrupted, `connectionError` is set to the thrown error, and all modals are closed.
  onSelect?: () => Promise<void>
}

export interface ConnectedWallet {
  wallet: Wallet
  client: WalletClient
}

export interface ModalClassNames {
  modalContent?: string
  modalOverlay?: string
  modalHeader?: string
  modalSubheader?: string
  modalCloseButton?: string
  walletList?: string
  wallet?: string
  walletImage?: string
  walletInfo?: string
  walletName?: string
  walletDescription?: string
  textContent?: string
}
