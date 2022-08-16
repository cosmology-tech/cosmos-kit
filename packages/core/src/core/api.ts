import { Wallets } from '@cosmos-kit/registry'
import {
  CosmosWalletInitializeConfig,
  CosmosWalletStateObserver,
  CosmosWalletStatus,
  Wallet,
} from '@cosmos-kit/types'

import { getChainInfo } from '../chainInfo'
import { getConnectedWalletInfo } from '../walletInfo'
import {
  addStateObservers,
  config,
  nextWalletConnectConnectionAttempt,
  onQrCloseCallback,
  setConfig,
  setOnQrCloseCallback,
  setWalletConnect,
  state,
  updateState,
  walletConnect,
  walletConnectConnectionAttempt,
} from './state'

const refreshListener = async () => {
  // Reconnect to wallet, since name/address may have changed.
  if (state.status === CosmosWalletStatus.Connected && state.connectedWallet) {
    // Remove refresh listener because it will be readded after connection.
    state.connectedWallet.wallet.removeRefreshListener?.(refreshListener)

    connectToWallet(state.connectedWallet.wallet)
  }
}

//! API

export const initialize = (
  initialConfig: CosmosWalletInitializeConfig,
  observers?: CosmosWalletStateObserver[]
) => {
  // Setup internal state.
  setConfig({
    ...initialConfig,
    // Fallback to all wallets.
    enabledWallets: initialConfig.enabledWallets ?? Wallets,
  })
  if (observers?.length) {
    addStateObservers(...observers)
  }

  // Initialize state.
  updateState({
    status: CosmosWalletStatus.Disconnected,
    // Pass through from initialization config.
    chainInfoOverrides: config.chainInfoOverrides,
    getSigningCosmWasmClientOptions: config.getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions: config.getSigningStargateClientOptions,
    enabledWallets: config.enabledWallets,
  })

  const maybeAutoConnect = async () => {
    // TODO: Add docs about autoconnect vs. preselect.
    // Check if any wallet should be autoconnected.
    const autoconnectWalletIndex = (
      await Promise.all(
        config.enabledWallets.map(
          ({ shouldAutoconnect }) => shouldAutoconnect?.() ?? false
        )
      )
    ).findIndex((value) => value)
    // Autoconnect to wallet if exists.
    if (autoconnectWalletIndex > -1) {
      return beginConnection(config.enabledWallets[autoconnectWalletIndex])
    }

    // Check local storage.
    const localStorageValue = config.localStorageKey
      ? localStorage.getItem(config.localStorageKey)
      : null
    const localStorageWallet =
      localStorageValue &&
      config.enabledWallets.find(({ id }) => id === localStorageValue)

    // If wallet found from localStorage value, auto connect.
    if (localStorageWallet) {
      return beginConnection(localStorageWallet)
    }
  }

  maybeAutoConnect()
}

// Closes modals and clears connection state.
export const cleanupAfterConnection = () => {
  updateState({
    walletConnectQrUri: undefined,
    connectingWallet: undefined,
  })
  // Cleanup WalletConnect QR if necessary.
  onQrCloseCallback?.()
  setOnQrCloseCallback(undefined)
}

// Connect WalletConnect client if necessary, and then connect to the wallet.
export const connectToWallet = async (wallet: Wallet) => {
  updateState({
    status: CosmosWalletStatus.Connecting,
    error: undefined,
    connectingWallet: wallet,
  })

  let walletClient: unknown

  // The actual meat of enabling and getting the wallet clients.
  const finalizeWalletConnection = async (newWcSession?: boolean) => {
    updateState({
      status: CosmosWalletStatus.EnablingWallet,
    })

    const chainInfo = await getChainInfo(
      config.defaultChainId,
      config.chainInfoOverrides
    )

    walletClient = await wallet.getClient(
      chainInfo,
      walletConnect,
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
      await config.getSigningCosmWasmClientOptions?.(chainInfo),
      await config.getSigningStargateClientOptions?.(chainInfo)
    )
    // Add refresh listener to update connected wallet info.
    wallet.addRefreshListener?.(refreshListener)

    // Allow to fail silently.
    try {
      await wallet.cleanupClient?.(walletClient)

      // Save localStorage value for future autoconnection.
      if (config.localStorageKey) {
        localStorage.setItem(config.localStorageKey, wallet.id)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
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
      if (!walletConnect) {
        setWalletConnect(
          new (await import('@walletconnect/client')).default({
            bridge: 'https://bridge.walletconnect.org',
            signingMethods: wallet.walletConnectSigningMethods,
            qrcodeModal: {
              open: (walletConnectQrUri, closeCallback) => {
                setOnQrCloseCallback(closeCallback)
                updateState({
                  status: CosmosWalletStatus.PendingWalletConnect,
                  walletConnectQrUri,
                })
              },
              // Occurs on disconnect, which is handled elsewhere.
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              close: () => {},
            },
            // clientMeta,
          })
        )
        // clientMeta in constructor is ignored for some reason, so
        // let's set it directly :)))))))))))))
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        walletConnect._clientMeta = config.walletConnectClientMeta
        // Detect disconnected WalletConnect session and clear wallet state.
        walletConnect.on('disconnect', () => {
          // eslint-disable-next-line no-console
          console.log('WalletConnect disconnected.')
          disconnect(true)
          cleanupAfterConnection()
        })
      }

      if (walletConnect.connected) {
        // WalletConnect already connected, nothing to do.
        await finalizeWalletConnection(false)
      } else {
        // Prevent double requests by checking which connection attempt
        // we're on before and after starting the connection attempt.
        const currConnectionAttempt = nextWalletConnectConnectionAttempt()

        // Executes walletConnect's qrcodeModal.open.
        await walletConnect.connect()

        // If another connection attempt is being made, don't try to
        // enable if connect finishes. This prevents double requests.
        if (walletConnectConnectionAttempt !== currConnectionAttempt) {
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
    // eslint-disable-next-line no-console
    console.error(error)

    updateState({
      status: CosmosWalletStatus.Errored,
      error,
    })
  } finally {
    cleanupAfterConnection()
  }
}

// Begin connection process, either auto-selecting a wallet or opening
// the selection modal.
export const beginConnection = async (wallet?: Wallet) => {
  if (state.status === CosmosWalletStatus.Uninitialized) {
    throw new Error('Cannot connect before initialization.')
  }

  updateState({
    status: CosmosWalletStatus.Connecting,
    error: undefined,
  })

  // If wallet passed, connect to it.
  if (wallet) {
    connectToWallet(wallet)
    return
  }

  // Check if modal should be displayed or skipped with a wallet preselected.
  const preselectedWallet =
    // If only one wallet is available, preselect it, no need to show modal.
    config.enabledWallets.length === 1
      ? config.enabledWallets[0]
      : // Connect to preselected wallet if present.
      config.preselectedWalletId
      ? config.enabledWallets.find(
          ({ id }) => id === config.preselectedWalletId
        )
      : undefined

  if (preselectedWallet) {
    connectToWallet(preselectedWallet)
    return
  }

  // If no preselected wallet, set status to choosing wallet to inform UI that a
  // wallet needs to be chosen and `connectToWallet` needs to be called
  // manually.
  updateState({
    status: CosmosWalletStatus.ChoosingWallet,
  })
}

// Disconnect from connected wallet.
export const disconnect = async (dontKillWalletConnect?: boolean) => {
  // Remove refresh listener.
  if (state.connectedWallet) {
    state.connectedWallet.wallet.removeRefreshListener?.(refreshListener)
  }

  // Disconnect wallet.
  updateState({
    status: CosmosWalletStatus.Disconnected,
    connectedWallet: undefined,
  })

  // Remove localStorage value.
  if (config.localStorageKey) {
    localStorage.removeItem(config.localStorageKey)
  }

  // Disconnect WalletConnect.
  if (walletConnect?.connected && !dontKillWalletConnect) {
    await walletConnect.killSession()
  }
  setWalletConnect(undefined)
}

// Reset.
export const reset = async () => {
  // eslint-disable-next-line no-console
  await disconnect().catch(console.error)
  // Try resetting all wallet state and reconnecting.
  if (state.connectingWallet) {
    cleanupAfterConnection()
    connectToWallet(state.connectingWallet)
  } else {
    // If no wallet to reconnect to, just reload.
    window.location.reload()
  }
}

// Interrupt connection process, such as if the user closes a connection modal.
export const stopConnecting = () => {
  updateState({
    status: CosmosWalletStatus.Disconnected,
    walletConnectQrUri: undefined,
    connectedWallet: undefined,
    connectingWallet: undefined,
  })
}
