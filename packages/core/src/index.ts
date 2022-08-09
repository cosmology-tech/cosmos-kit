import WalletConnect from '@walletconnect/client'

import {
  CosmosWalletInitializeConfig,
  CosmosWalletState,
  CosmosWalletStateObserver,
  Wallet,
  WalletConnectionStatus as CosmosWalletStatus,
} from './types'
import { getChainInfo } from './chainInfo'
import { getConnectedWalletInfo } from './wallet'

//! INTERNAL

let _config: CosmosWalletInitializeConfig
let _state: CosmosWalletState = {
  displayingPicker: false,
  enablingWallet: false,
  walletConnectQrUri: undefined,
  connectedWallet: undefined,
  status: CosmosWalletStatus.Uninitialized,
  error: undefined,
  chainInfoOverrides: undefined,
  getSigningCosmWasmClientOptions: undefined,
  getSigningStargateClientOptions: undefined,
}

let _walletConnect: WalletConnect | undefined
// Call when closing QR code modal manually.
let _onQrCloseCallback: (() => void) | undefined

// In case WalletConnect fails to load, we need to be able to retry.
// This is done through clicking reset on the WalletConnectModal.
let _connectingWallet: Wallet | undefined
let _connectionAttemptRef = 0

// Closes modals and clears connection state.
const _cleanupAfterConnection = () => {
  // Close modals.
  updateState({
    displayingPicker: false,
    enablingWallet: false,
    walletConnectQrUri: undefined,
  })
  // No longer connecting a wallet.
  _connectingWallet = undefined
  // Cleanup WalletConnect QR if necessary since modal is now closed (URI set to
  // undefined).
  _onQrCloseCallback?.()
  _onQrCloseCallback = undefined
}

// Connect WalletConnect client if necessary, and then connect to the wallet.
const _connectToWallet = async (wallet: Wallet) => {
  _connectingWallet = wallet
  updateState({
    status: CosmosWalletStatus.Connecting,
    error: undefined,
    displayingPicker: false,
  })

  let walletClient: unknown

  // The actual meat of enabling and getting the wallet clients.
  const finalizeWalletConnection = async (newWcSession?: boolean) => {
    // Cleared in `cleanupAfterConnection`.
    updateState({
      enablingWallet: true,
    })

    const chainInfo = await getChainInfo(
      _config.defaultChainId,
      _config.chainInfoOverrides
    )

    walletClient = await wallet.getClient(
      chainInfo,
      _walletConnect,
      newWcSession
    )
    if (!walletClient) {
      throw new Error('Failed to retrieve wallet client.')
    }

    // Enable and connect to wallet, and retrieve data.
    const connectedWallet = await getConnectedWalletInfo(
      wallet,
      walletClient,
      chainInfo,
      await _config.getSigningCosmWasmClientOptions?.(chainInfo),
      await _config.getSigningStargateClientOptions?.(chainInfo)
    )
    // Add refresh listener to update connected wallet info.
    wallet.addRefreshListener?.(_refreshListener)

    // Allow to fail silently.
    try {
      await wallet.cleanupClient?.(walletClient)

      // Save localStorage value for future autoconnection.
      if (_config.localStorageKey) {
        localStorage.setItem(_config.localStorageKey, wallet.id)
      }
    } catch (err) {
      console.error(err)
    }

    updateState({
      status: CosmosWalletStatus.Connected,
      connectedWallet,
    })
  }

  try {
    // Connect to WalletConnect if necessary.
    if (wallet.isWalletConnect) {
      if (!wallet.walletConnectSigningMethods) {
        throw new Error(
          'Wallet definition missing WalletConnect signing methods.'
        )
      }

      // Instantiate new WalletConnect instance if necessary.
      if (!_walletConnect) {
        _walletConnect = new (await import('@walletconnect/client')).default({
          bridge: 'https://bridge.walletconnect.org',
          signingMethods: wallet.walletConnectSigningMethods,
          qrcodeModal: {
            open: (walletConnectQrUri, closeCallback) => {
              _onQrCloseCallback = closeCallback
              updateState({
                walletConnectQrUri,
              })
            },
            // Occurs on disconnect, which is handled elsewhere.
            close: () => console.log('qrcodeModal.close'),
          },
          // clientMeta,
        })
        // clientMeta in constructor is ignored for some reason, so
        // let's set it directly :)))))))))))))
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _walletConnect._clientMeta = walletConnectClientMeta
        // Detect disconnected WalletConnect session and clear wallet state.
        _walletConnect.on('disconnect', () => {
          console.log('WalletConnect disconnected.')
          disconnect(true)
          _cleanupAfterConnection()
        })
      }

      if (_walletConnect.connected) {
        // WalletConnect already connected, nothing to do.
        await finalizeWalletConnection(false)
      } else {
        // Prevent double requests by checking which connection attempt
        // we're on before and after starting the connection attempt.
        const currConnectionAttempt = ++_connectionAttemptRef

        // Executes walletConnect's qrcodeModal.open.
        await _walletConnect.connect()

        // If another connection attempt is being made, don't try to
        // enable if connect finishes. This prevents double requests.
        if (_connectionAttemptRef !== currConnectionAttempt) {
          return
        }

        // Connect with new WalletConnect session.
        await finalizeWalletConnection(true)
      }
    } else {
      // No WalletConnect needed.
      await finalizeWalletConnection()
    }
  } catch (error) {
    console.error(error)

    updateState({
      status: CosmosWalletStatus.Errored,
      error,
    })
  } finally {
    _cleanupAfterConnection()
  }
}

const _refreshListener = async () => {
  // Reconnect to wallet, since name/address may have changed.
  if (
    _state.status === CosmosWalletStatus.Connected &&
    _state.connectedWallet
  ) {
    // Remove refresh listener because it will be readded after connection.
    _state.connectedWallet.wallet.removeRefreshListener?.(_refreshListener)

    _connectToWallet(_state.connectedWallet.wallet)
  }
}

//! API

const _stateObservers: CosmosWalletStateObserver[] = []

export const addStateObserver = (observer: CosmosWalletStateObserver) => {
  if (_stateObservers.includes(observer)) {
    return
  }

  _stateObservers.push(observer)
}

export const removeStateObserver = (observer: CosmosWalletStateObserver) => {
  if (!_stateObservers.includes(observer)) {
    return
  }

  // Remove observer at index.
  _stateObservers.splice(
    _stateObservers.findIndex((existing) => existing === observer),
    1
  )
}

const updateState = (state: Partial<CosmosWalletState>) => {
  _state = {
    ..._state,
    // Override current state.
    ...state,
  }

  // Notify observers.
  _stateObservers.forEach((observer) => observer(_state))
}

export const initialize = (
  config: CosmosWalletInitializeConfig,
  observers: CosmosWalletStateObserver[]
) => {
  // Setup internal state.
  _config = config
  _stateObservers.push(...observers)

  // Set status.
  updateState({
    status: CosmosWalletStatus.Disconnected,
    // Pass through from initialization config.
    chainInfoOverrides: _config.chainInfoOverrides,
    getSigningCosmWasmClientOptions: _config.getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions: _config.getSigningStargateClientOptions,
  })

  const maybeAutoConnect = async () => {
    // TODO: Add docs about autoconnect vs. preselect.
    // Check if any wallet should be autoconnected.
    const autoconnectWalletIndex = (
      await Promise.all(
        _config.enabledWallets.map(
          ({ shouldAutoconnect }) => shouldAutoconnect?.() ?? false
        )
      )
    ).findIndex((value) => value)
    // Autoconnect to wallet if exists.
    if (autoconnectWalletIndex > -1) {
      return connect(_config.enabledWallets[autoconnectWalletIndex])
    }

    // Check local storage.
    const localStorageValue = _config.localStorageKey
      ? localStorage.getItem(_config.localStorageKey)
      : null
    const localStorageWallet =
      localStorageValue &&
      _config.enabledWallets.find(({ id }) => id === localStorageValue)

    // If wallet found from localStorage value, auto connect.
    if (localStorageWallet) {
      return connect(localStorageWallet)
    }
  }

  maybeAutoConnect()
}

// Begin connection process, either auto-selecting a wallet or opening
// the selection modal.
const connect = async (wallet?: Wallet) => {
  // TODO: Add some docs about this.
  if (_state.status === CosmosWalletStatus.Uninitialized) {
    throw new Error('Cannot connect before initialization.')
  }

  updateState({
    status: CosmosWalletStatus.Connecting,
    error: undefined,
  })

  // If wallet passed, connect to it.
  if (wallet) {
    _connectToWallet(wallet)
    return
  }

  // Check if modal should be displayed or skipped with a wallet preselected.
  const preselectedWallet =
    // If only one wallet is available, preselect it, no need to show modal.
    _config.enabledWallets.length === 1
      ? _config.enabledWallets[0]
      : // Connect to preselected wallet if present.
      _config.preselectedWalletId
      ? _config.enabledWallets.find(
          ({ id }) => id === _config.preselectedWalletId
        )
      : undefined

  if (preselectedWallet) {
    _connectToWallet(preselectedWallet)
    return
  }

  // If no preselected wallet, open modal to choose one.
  updateState({
    displayingPicker: true,
  })
}

// Disconnect from connected wallet.
export const disconnect = async (dontKillWalletConnect?: boolean) => {
  if (_state.connectedWallet) {
    // Remove refresh listener.
    _state.connectedWallet.wallet.removeRefreshListener?.(_refreshListener)
  }
  // Disconnect wallet.
  updateState({
    status: CosmosWalletStatus.Disconnected,
    connectedWallet: undefined,
  })
  // Remove localStorage value.
  if (_config.localStorageKey) {
    localStorage.removeItem(_config.localStorageKey)
  }

  // Disconnect WalletConnect.
  if (_walletConnect?.connected && !dontKillWalletConnect) {
    await _walletConnect.killSession()
  }
  _walletConnect = undefined
}

// Reset.
export const reset = async () => {
  await disconnect().catch(console.error)
  // Try resetting all wallet state and reconnecting.
  if (_connectingWallet) {
    _cleanupAfterConnection()
    // Updates state to Connecting.
    _connectToWallet(_connectingWallet)
  } else {
    // If no wallet to reconnect to, just reload.
    window.location.reload()
  }
}
