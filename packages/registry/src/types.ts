export interface WalletInfo {
  // A unique identifier among all wallets.
  id: string
  // The name of the wallet.
  name: string
  // A description of the wallet.
  description: string
  // The URL of the wallet logo.
  imageUrl: string
  // If this wallet needs WalletConnect to establish client connection.
  isWalletConnect: boolean
}
