import { StateFrom, InterpreterFrom } from 'xstate'
import { ConnectedWallet, walletMachine } from '@cosmos-wallet/core'
import { WalletMachineContextType } from '@cosmos-wallet/core/src'

export interface IWalletManagerContext {
  // Function to begin the connection process. This will either display
  // the wallet picker modal or immediately attempt to connect to a wallet
  // depending on the props passed to WalletManagerProvider.
  connect: () => void
  // Function that disconnects from the connected wallet.
  disconnect: () => void
  // Wallet machine state.
  state: StateFrom<typeof walletMachine>
  // Wallet machine event sender.
  send: InterpreterFrom<typeof walletMachine>['send']
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

export type UseWalletResponse = Partial<ConnectedWallet> & {
  /* selecting, or connecting to the wallet */
  connecting: boolean
  /* connected to the wallet */
  connected: boolean
  /* if passed the machine is in the error state */
  error?: WalletMachineContextType['error']
}
