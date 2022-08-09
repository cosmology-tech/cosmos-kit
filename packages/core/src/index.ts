import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClientOptions } from '@cosmjs/stargate'
import WalletConnect from '@walletconnect/client'
import { IClientMeta } from '@walletconnect/types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  ChainInfoOverrides,
  ConnectedWallet,
  SigningClientGetter,
  Wallet,
  WalletConnectionStatus,
} from './types'
import { getChainInfo } from './chainInfo'
import { getConnectedWalletInfo } from './wallet'

// Wallets available for connection.
const enabledWallets: Wallet[] = []
// Chain ID to initially connect to and selected by default if nothing
// is passed to the hook. Must be present in one of the objects in
// `chainInfoList`.
const defaultChainId = ''
// List or getter of additional or replacement ChainInfo objects. These
// will take precedent over internal definitions by comparing `chainId`.
const chainInfoOverrides: ChainInfoOverrides | undefined = undefined
// Descriptive info about the webapp which gets displayed when enabling a
// WalletConnect wallet (e.g. name, image, etc.).
const walletConnectClientMeta: IClientMeta | undefined = undefined
// When set to a valid wallet ID, the connect function will skip the selection
// modal and attempt to connect to this wallet immediately.
const preselectedWalletId: string | undefined = undefined
// localStorage key for saving, loading, and auto connecting to a wallet.
const localStorageKey: string | undefined = undefined
// Callback that will be attached as a listener to the
// `keplr_keystorechange` event on the window object.
const onKeplrKeystoreChangeEvent: (event: Event) => unknown | undefined =
  undefined
// Getter for options passed to SigningCosmWasmClient on connection.
const getSigningCosmWasmClientOptions:
  | SigningClientGetter<SigningCosmWasmClientOptions>
  | undefined = undefined
// Getter for options passed to SigningStargateClient on connection.
const getSigningStargateClientOptions:
  | SigningClientGetter<SigningStargateClientOptions>
  | undefined = undefined

const [isEmbeddedKeplrMobileWeb, setIsEmbeddedKeplrMobileWeb] = useState(false)

// Modal State
const [pickerModalOpen, setPickerModalOpen] = useState(false)
const [walletEnableModalOpen, setWalletEnableModalOpen] = useState(false)
// If set, opens QR code modal.
const [walletConnectUri, setWalletConnectUri] = useState<string>()

// WalletConnect State
const [walletConnect, setWalletConnect] = useState<WalletConnect>()
// Call when closing QR code modal manually.
const onQrCloseCallback = useRef<() => void>()

// Wallet connection State
const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>()
const [error, setError] = useState<unknown>()
// Once mobile web is checked, we are ready to auto-connect.
const [status, setStatus] = useState<WalletConnectionStatus>(
  WalletConnectionStatus.Initializing
)
// In case WalletConnect fails to load, we need to be able to retry.
// This is done through clicking reset on the WalletConnectModal.
const [connectingWallet, setConnectingWallet] = useState<Wallet>()
const connectionAttemptRef = useRef(0)
// Reset connection when it gets stuck somewhere.
const [connectToWalletUponReset, setConnectToWalletUponReset] =
  useState<Wallet>()

//! CALLBACKS

// Retrieve chain info for initial wallet connection, throwing error if
// not found.
const _getDefaultChainInfo = useCallback(
  async () => await getChainInfo(defaultChainId, chainInfoOverrides),
  [defaultChainId, chainInfoOverrides]
)

// Closes modals and clears connection state.
const _cleanupAfterConnection = useCallback(() => {
  // Close modals.
  setPickerModalOpen(false)
  setWalletConnectUri(undefined)
  setWalletEnableModalOpen(false)
  // No longer connecting a wallet.
  setConnectingWallet(undefined)
}, [])

// Disconnect from connected wallet.
const disconnect = useCallback(
  async (dontKillWalletConnect?: boolean) => {
    // Disconnect wallet.
    setConnectedWallet(undefined)
    setStatus(WalletConnectionStatus.ReadyForConnection)
    // Remove localStorage value.
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey)
    }

    // Disconnect WalletConnect.
    setWalletConnect(undefined)
    if (walletConnect?.connected && !dontKillWalletConnect) {
      await walletConnect.killSession()
    }
  },
  [localStorageKey, walletConnect]
)

// Obtain WalletConnect if necessary, and connect to the wallet.
const _connectToWallet = useCallback(
  async (wallet: Wallet) => {
    setStatus(WalletConnectionStatus.Connecting)
    setError(undefined)
    setConnectingWallet(wallet)
    setPickerModalOpen(false)

    let walletClient: unknown
    let _walletConnect = walletConnect

    // The actual meat of enabling and getting the wallet clients.
    const finalizeWalletConnection = async (newWcSession?: boolean) => {
      // Cleared in `cleanupAfterConnection`.
      setWalletEnableModalOpen(true)

      const chainInfo = await _getDefaultChainInfo()

      walletClient = await wallet.getClient(
        chainInfo,
        _walletConnect,
        newWcSession
      )
      if (!walletClient) {
        throw new Error('Failed to retrieve wallet client.')
      }

      // Save connected wallet data.
      setConnectedWallet(
        await getConnectedWalletInfo(
          wallet,
          walletClient,
          chainInfo,
          await getSigningCosmWasmClientOptions?.(chainInfo),
          await getSigningStargateClientOptions?.(chainInfo)
        )
      )

      // Save localStorage value.
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, wallet.id)
      }

      setStatus(WalletConnectionStatus.Connected)

      // Allow cleanup to fail silently.
      await wallet.cleanupClient?.(walletClient).catch(console.error)
    }

    try {
      // Connect to WalletConnect if necessary.
      if (wallet.isWalletConnect) {
        // Instantiate new WalletConnect instance if necessary.
        if (!_walletConnect) {
          _walletConnect = new (await import('@walletconnect/client')).default({
            bridge: 'https://bridge.walletconnect.org',
            signingMethods: [
              'keplr_enable_wallet_connect_v1',
              'keplr_sign_amino_wallet_connect_v1',
            ],
            qrcodeModal: {
              open: (uri: string, cb: () => void) => {
                // Open QR modal by setting URI.
                setWalletConnectUri(uri)
                onQrCloseCallback.current = cb
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
          setWalletConnect(_walletConnect)
        }

        if (_walletConnect.connected) {
          // WalletConnect already connected, nothing to do.
          await finalizeWalletConnection(false)
        } else {
          // Prevent double requests by checking which connection attempt
          // we're on before and after starting the connection attempt.
          const currConnectionAttempt = ++connectionAttemptRef.current

          // Executes walletConnect's qrcodeModal.open.
          await _walletConnect.connect()

          // If another connection attempt is being made, don't try to
          // enable if connect finishes. This prevents double requests.
          if (connectionAttemptRef.current !== currConnectionAttempt) {
            return
          }

          // Connect with new WalletConnect session.
          await finalizeWalletConnection(true)
        }
      } else {
        // No WalletConnect needed.
        await finalizeWalletConnection()
      }
    } catch (err) {
      console.error(err)
      setError(err)
      setStatus(WalletConnectionStatus.Errored)
    } finally {
      _cleanupAfterConnection()
    }
  },
  [
    walletConnect,
    _getDefaultChainInfo,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
    localStorageKey,
    walletConnectClientMeta,
    _cleanupAfterConnection,
  ]
)

// Begin connection process, either auto-selecting a wallet or opening
// the selection modal.
const beginConnection = useCallback(async () => {
  // We need to check if we are in the embedded Keplr Mobile web before
  // connecting, since we will force the embedded Keplr wallet if
  // possible. This will only happen if `connect` is called very quickly
  // without waiting for `state` to reach at least
  // `State.AttemptingAutoConnection`, though ideally `connect` is only
  // called once `state` reaches `State.ReadyForConnection`.
  // TODO: Add some docs about this.
  if (status === WalletConnectionStatus.Initializing) {
    throw new Error('Cannot connect while initializing.')
  }

  setStatus(WalletConnectionStatus.Connecting)
  setError(undefined)

  // TODO: Add some docs about the various ways wallets get auto/pre-selected
  // and the difference between autoselect and preselect.
  // Check if any wallet should be autoselected.
  const autoselectedWalletIndex = (
    await Promise.all(
      enabledWallets.map(
        ({ shouldAutoselect }) => shouldAutoselect?.() ?? false
      )
    )
  ).findIndex((value) => value)

  const automaticWalletId =
    // Connect to autoselected wallet automatically.
    autoselectedWalletIndex > -1
      ? enabledWallets[autoselectedWalletIndex]
      : // Connect to preselected wallet automatically.
        preselectedWalletId ||
        // Try to fetch value from localStorage.
        (localStorageKey && localStorage.getItem(localStorageKey)) ||
        undefined

  const skipModalWallet =
    // If only one wallet is available, skip the modal and use it.
    enabledWallets.length === 1
      ? enabledWallets[0]
      : // Try to find the wallet to automatically connect to if present.
      automaticWalletId
      ? enabledWallets.find(({ id }) => id === automaticWalletId)
      : undefined

  if (skipModalWallet) {
    _connectToWallet(skipModalWallet)
    return
  }

  // If no default wallet, open modal to choose one.
  setPickerModalOpen(true)
}, [
  status,
  localStorageKey,
  isEmbeddedKeplrMobileWeb,
  enabledWallets,
  _connectToWallet,
])

// Initiate reset.
const _reset = useCallback(async () => {
  await disconnect().catch(console.error)
  // Set after disconnect, since disconnect sets state to
  // ReadyForConnection.
  setStatus(WalletConnectionStatus.Resetting)
  // Try resetting all wallet state and reconnecting.
  if (connectingWallet) {
    setConnectToWalletUponReset(connectingWallet)
    _cleanupAfterConnection()
  } else {
    // If no wallet to reconnect to, just reload.
    window.location.reload()
  }
}, [_cleanupAfterConnection, connectingWallet, disconnect])

//! EFFECTS

// Detect if in embedded Keplr Mobile browser, and set ready after.
useEffect(() => {
  if (
    status !== WalletConnectionStatus.Initializing ||
    // Only run this on a browser.
    typeof window === 'undefined'
  ) {
    return
  }

  import('@keplr-wallet/stores')
    .then(({ getKeplrFromWindow }) => getKeplrFromWindow())
    .then(
      (keplr) =>
        keplr &&
        keplr.mode === 'mobile-web' &&
        setIsEmbeddedKeplrMobileWeb(true)
    )
    .finally(() => setStatus(WalletConnectionStatus.AttemptingAutoConnection))
}, [status])

// Auto connect on mount handler, after the above mobile web check.
useEffect(() => {
  if (
    status !== WalletConnectionStatus.AttemptingAutoConnection ||
    // Only run this on a browser.
    typeof localStorage === 'undefined'
  ) {
    return
  }

  setStatus(WalletConnectionStatus.ReadyForConnection)

  if (
    // If inside Keplr mobile web, auto connect.
    isEmbeddedKeplrMobileWeb ||
    // If localStorage value present, auto connect.
    (localStorageKey && !!localStorage.getItem(localStorageKey))
  ) {
    beginConnection()
  }
}, [status, beginConnection, isEmbeddedKeplrMobileWeb, localStorageKey])

// Execute onQrCloseCallback if WalletConnect URI is cleared, since it
// has now been closed.
useEffect(() => {
  if (!walletConnectUri && onQrCloseCallback) {
    onQrCloseCallback.current?.()
    onQrCloseCallback.current = undefined
  }
}, [walletConnectUri, onQrCloseCallback])

// Attempt reconnecting to a wallet after resetting if we have set a
// wallet to select after resetting.
useEffect(() => {
  if (
    status === WalletConnectionStatus.Resetting &&
    !connectingWallet &&
    connectToWalletUponReset
  ) {
    setConnectToWalletUponReset(undefined)
    // Updates state to Connecting.
    _connectToWallet(connectToWalletUponReset)
  }
}, [connectingWallet, status, _connectToWallet, connectToWalletUponReset])

// WalletConnect disconnect listener.
useEffect(() => {
  if (!walletConnect) {
    return
  }

  // Detect disconnected WC session and clear wallet state.
  walletConnect.on('disconnect', () => {
    console.log('WalletConnect disconnected.')
    disconnect(true)
    _cleanupAfterConnection()
  })

  // Clean up
  return () => walletConnect.off('disconnect')
}, [_cleanupAfterConnection, disconnect, walletConnect])

// keplr_keystorechange event listener.
useEffect(() => {
  if (
    // Only run this on a browser.
    typeof window === 'undefined'
  ) {
    return
  }

  const listener = async (event: Event) => {
    // Reconnect to wallet, since name/address may have changed.
    if (status === WalletConnectionStatus.Connected && connectedWallet) {
      _connectToWallet(connectedWallet.wallet)
    }

    // Execute callback if passed.
    onKeplrKeystoreChangeEvent?.(event)
  }

  // Add event listener.
  window.addEventListener('keplr_keystorechange', listener)

  // Remove event listener on clean up.
  return () => {
    window.removeEventListener('keplr_keystorechange', listener)
  }
}, [onKeplrKeystoreChangeEvent, connectedWallet, status, _connectToWallet])

// Memoize context data.
const value = useMemo(
  () => ({
    connect: beginConnection,
    disconnect,
    connectedWallet,
    status,
    connected: status === WalletConnectionStatus.Connected,
    error,
    isEmbeddedKeplrMobileWeb,
    chainInfoOverrides,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
  }),
  [
    beginConnection,
    chainInfoOverrides,
    connectedWallet,
    disconnect,
    error,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
    isEmbeddedKeplrMobileWeb,
    status,
  ]
)
