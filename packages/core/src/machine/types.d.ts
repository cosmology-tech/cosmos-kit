import type { walletMachineInitialContext } from './context'
import type { ChainInfoID, ConnectedWallet, WalletType } from '../types'
import type WalletConnect from '@walletconnect/client'
import type { Sender, State } from 'xstate'

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
  | {
      type: 'WALLET_ENABLE'
      connectedWallet: ConnectedWallet
      chainId: ChainInfoID
    }
  | { type: 'CONNECT_ADDITIONAL_CHAIN'; chainId: ChainInfoID }
  | { type: 'RESET' }
  | { type: 'CONNECTED' }
  | { type: 'RECONNECT' }
  | { type: 'DISCONNECT' }

export type WalletMachineState = State<
  WalletMachineContextType,
  WalletMachineEvent
>

export type WalletMachineEventSender = Sender<WalletMachineEvent>
