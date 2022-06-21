import { createContext, useContext } from "react"

import { ConnectedWallet } from "../types"

export interface WalletManagerContextInterface {
  // Function to begin the connection process. This will either display the wallet picker modal or immediately attempt to connect to a wallet when `preselectedWalletId` is set.
  connect: () => void
  // Function that disconnects from the connected wallet.
  disconnect: () => Promise<void>
  // Connected wallet information and client.
  connectedWallet?: ConnectedWallet
  // Error encountered during the connection process. Can be anything since the `enableWallet` function can throw anything.
  connectionError?: unknown
  // If this app is running inside the Keplr Mobile web interface.
  isMobileWeb: boolean
}

export const WalletManagerContext =
  createContext<WalletManagerContextInterface | null>(null)

export const useWalletManager = () => {
  const context = useContext(WalletManagerContext)
  if (!context) {
    throw new Error("You forgot to use WalletManagerProvider")
  }

  return context
}
