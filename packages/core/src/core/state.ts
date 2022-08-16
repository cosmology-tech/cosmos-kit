import {
  CosmosWalletConfig,
  CosmosWalletState,
  CosmosWalletStateObserver,
  CosmosWalletStatus,
} from '@cosmos-kit/types'
import WalletConnect from '@walletconnect/client'

//! INTERNAL

export let config: CosmosWalletConfig
export const setConfig = (value: typeof config) => {
  config = value
}

export let walletConnectConnectionAttempt = 0
export const nextWalletConnectConnectionAttempt = () =>
  ++walletConnectConnectionAttempt

export let walletConnect: WalletConnect | undefined
export const setWalletConnect = (value: typeof walletConnect) => {
  walletConnect = value
}

// Call when closing QR code modal manually.
export let onQrCloseCallback: (() => void) | undefined
export const setOnQrCloseCallback = (value: typeof onQrCloseCallback) => {
  onQrCloseCallback = value
}

//! EXTERNAL

export let state: CosmosWalletState = {
  walletConnectQrUri: undefined,
  connectedWallet: undefined,
  connectingWallet: undefined,
  status: CosmosWalletStatus.Uninitialized,
  error: undefined,
  chainInfoOverrides: undefined,
  getSigningCosmWasmClientOptions: undefined,
  getSigningStargateClientOptions: undefined,
  enabledWallets: [],
}

const stateObservers: CosmosWalletStateObserver[] = []

export const addStateObservers = (...observers: CosmosWalletStateObserver[]) =>
  stateObservers.push(
    // Filter out duplicates.
    ...observers.filter((observer) => !stateObservers.includes(observer))
  )

export const removeStateObserver = (observer: CosmosWalletStateObserver) => {
  if (!stateObservers.includes(observer)) {
    return
  }

  // Remove observer at index.
  stateObservers.splice(
    stateObservers.findIndex((existing) => existing === observer),
    1
  )
}

export const updateState = (newState: Partial<CosmosWalletState>) => {
  state = {
    ...state,
    // Override current state.
    ...newState,
  }

  // Notify observers.
  stateObservers.forEach((observer) => observer(state))
}
