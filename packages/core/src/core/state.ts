import {
  CosmosKitConfig,
  CosmosKitState,
  CosmosKitStateObserver,
  CosmosKitStatus,
} from '@cosmos-kit/types'
import WalletConnect from '@walletconnect/client'

//! INTERNAL

export let config: CosmosKitConfig
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

export let state: CosmosKitState = {
  walletConnectQrUri: undefined,
  connectedWallet: undefined,
  connectingWallet: undefined,
  status: CosmosKitStatus.Uninitialized,
  error: undefined,
  chainInfo: {
    assets: [],
    chains: [],
  },
  getSigningCosmWasmClientOptions: undefined,
  getSigningStargateClientOptions: undefined,
  enabledWallets: [],
}

const stateObservers: CosmosKitStateObserver[] = []

export const addStateObservers = (...observers: CosmosKitStateObserver[]) =>
  stateObservers.push(
    // Filter out duplicates.
    ...observers.filter((observer) => !stateObservers.includes(observer))
  )

export const removeStateObserver = (observer: CosmosKitStateObserver) => {
  if (!stateObservers.includes(observer)) {
    return
  }

  // Remove observer at index.
  stateObservers.splice(
    stateObservers.findIndex((existing) => existing === observer),
    1
  )
}

export const updateState = (newState: Partial<CosmosKitState>) => {
  state = {
    ...state,
    // Override current state.
    ...newState,
  }

  // Notify observers.
  stateObservers.forEach((observer) => observer(state))
}
