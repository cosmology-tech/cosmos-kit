import {
  ConnectedWallet,
  CosmosWalletInitializeConfig,
  CosmosWalletState,
  Wallet,
} from '@cosmos-kit/types'
import { ReactNode } from 'react'

export interface IWalletManagerContext extends CosmosWalletState {
  // Function to begin the connection process. This will either display
  // the wallet picker modal or immediately attempt to connect to a wallet
  // depending on the props passed to WalletManagerProvider.
  connect: (wallet?: Wallet) => void
  // Function that disconnects from the connected wallet.
  disconnect: () => Promise<void>
  // If status is Connected.
  connected: boolean
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

export type UseWalletResponse = Partial<ConnectedWallet> &
  Pick<IWalletManagerContext, 'status' | 'connected' | 'error'>

export interface WalletManagerProviderProps
  extends CosmosWalletInitializeConfig {
  children: ReactNode | ReactNode[]
  // Class names applied to various components for custom theming.
  classNames?: ModalClassNames
  // Custom close icon.
  closeIcon?: ReactNode
  // A custom loader to display in the modals, such as enabling the wallet.
  renderLoader?: () => ReactNode
}
