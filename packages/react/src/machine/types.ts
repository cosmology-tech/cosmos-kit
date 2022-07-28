import { walletMachineInitialContext } from './context'
import { ConnectedWallet, WalletType } from '../types'
import WalletConnect from '@walletconnect/client'

export type WalletMachineContextType = typeof walletMachineInitialContext

export type WalletMachineEvent =
  | {
      type: 'RECEIVE_WALLET_CONNECT_URI'
      walletConnectUri: string
      cleanUpWalletConnectCallback: () => void
    }
  | {
      type: 'RECEIVED_INITIAL_STATE'
      walletType: WalletType
      isEmbeddedKeplrMobileWeb: boolean
    }
  | {
      type: 'SELECT_WALLET'
      walletType: WalletType
    }
  | {
      type: 'REQUEST_WALLET_CONNECT_FULFILLED'
      walletConnect: WalletConnect
      instantiateWebsocketConnection?: boolean
    }
  | {
      type: 'NAVIGATE_TO_WALLET_CONNECT_APP'
    }
  | { type: 'WALLET_ENABLE'; connectedWallet: ConnectedWallet }
  | { type: 'RESET' }
  | { type: 'CONNECTED' }
  | { type: 'RECONNECT' }
  | { type: 'DISCONNECT' }
