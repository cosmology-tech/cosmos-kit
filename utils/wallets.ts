import { getKeplrFromWindow } from "@keplr-wallet/stores"

import { KeplrWalletConnectV1 } from "../connectors"
import { Wallet, WalletType } from "../types"

// TODO: Move imageUrl, and maybe name/description, to user configuration somehow, or incorporate in planned configurable UI overhaul.

export const KeplrWallet: Wallet = {
  type: WalletType.Keplr,
  name: "Keplr Wallet",
  description: "Keplr Chrome Extension",
  imageUrl: "/keplr-wallet-extension.png",
  getClient: getKeplrFromWindow,
  getOfflineSignerFunction: (client) =>
    // This function expects to be bound to the `client` instance.
    client.getOfflineSignerAuto.bind(client),
}

export const WalletConnectKeplrWallet: Wallet = {
  type: WalletType.WalletConnectKeplr,
  name: "WalletConnect",
  description: "Keplr Mobile",
  imageUrl: "/walletconnect-keplr.png",
  getClient: async (chainInfo, walletConnect) => {
    if (walletConnect?.connected) {
      return new KeplrWalletConnectV1(walletConnect, [chainInfo])
    }
    throw new Error("Mobile wallet not connected.")
  },
  // WalletConnect only supports Amino signing.
  getOfflineSignerFunction: (client) =>
    // This function expects to be bound to the `client` instance.
    client.getOfflineSignerOnlyAmino.bind(client),
}

export const Wallets: Wallet[] = [KeplrWallet, WalletConnectKeplrWallet]
