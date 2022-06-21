import WalletConnect from "@walletconnect/client"
import { IClientMeta } from "@walletconnect/types"
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { KeplrWalletConnectV1 } from "../connectors"
import { ModalClassNames, Wallet, WalletClient } from "../types"
import {
  BaseModal,
  EnablingWalletModal,
  SelectWalletModal,
  WalletConnectModal,
} from "./ui"
import { WalletManagerContext } from "./WalletManagerContext"

enum InitState {
  NeedMobileWeb,
  NeedAutoConnect,
  Ready,
}

// Causes SSR issues if importing this package directly... idk why
const getKeplrFromWindow = async () =>
  (await import("@keplr-wallet/stores")).getKeplrFromWindow()

const MobileWebWallet: Wallet = {
  id: "mobile-web",
  name: "",
  description: "",
  imageUrl: "",
  getClient: getKeplrFromWindow,
  isWalletConnect: false,
}

export interface WalletManagerProviderProps {
  // Wallets available for connection.
  wallets: Wallet[]
  // Function that enables the wallet once one is selected.
  enableWallet: (
    wallet: Wallet,
    walletClient: WalletClient
  ) => Promise<void> | void
  // Class names applied to various components for custom theming.
  classNames?: ModalClassNames
  // Custom close icon.
  closeIcon?: ReactNode
  // When set, the connect function will skip the selection modal and attempt to connect to this wallet immediately.
  preselectedWalletId?: string | undefined
  // Descriptive info about the React app which gets displayed when enabling a WalletConnect wallet (e.g. name, image, etc.).
  walletConnectClientMeta?: IClientMeta
  // If set to true on initial mount, the connect function will be called as soon as possible. If `preselectedWalletId` is also set and a wallet has previously connected and enabled, this can be used to seamlessly reconnect a past session.
  attemptAutoConnect?: boolean
  // A custom loader to display in a few modals, such as when enabling the wallet.
  renderLoader?: () => ReactNode
}

export const WalletManagerProvider: FunctionComponent<
  WalletManagerProviderProps
> = ({
  wallets,
  enableWallet,
  children,
  classNames,
  closeIcon,
  preselectedWalletId,
  walletConnectClientMeta,
  attemptAutoConnect,
  renderLoader,
}) => {
  const [pickerModalOpen, setPickerModalOpen] = useState(false)
  // If set, opens QR code modal.
  const [walletConnectUri, setWalletConnectUri] = useState<string>()
  const [walletEnableModalOpen, setWalletEnableModalOpen] = useState(false)
  // Call when closing QR code modal manually.
  const onQrCloseCallback = useRef<() => void>()
  useEffect(() => {
    if (!walletConnectUri && onQrCloseCallback) {
      onQrCloseCallback.current?.()
      onQrCloseCallback.current = undefined
    }
  }, [walletConnectUri, onQrCloseCallback])

  // Wallet connection state.
  const [connectedWallet, setConnectedWallet] = useState<{
    wallet: Wallet
    client: WalletClient
  }>()
  const [connectionError, setConnectionError] = useState<unknown>()
  const [walletConnect, setWalletConnect] = useState<WalletConnect>()
  // Once mobile web is checked, we are ready to auto-connect.
  const [initState, setInitState] = useState<InitState>(InitState.NeedMobileWeb)
  // In case WalletConnect fails to load, we need to be able to retry.
  // This is done through clicking reset on the WalletConnectModal.
  const [connectingWallet, setConnectingWallet] = useState<Wallet>()
  const connectionAttemptRef = useRef(0)

  // Detect if is inside Keplr mobile web, and set ready once checked.
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  useEffect(() => {
    if (initState !== InitState.NeedMobileWeb) return

    getKeplrFromWindow()
      .then(
        (keplr) => keplr && keplr.mode === "mobile-web" && setIsMobileWeb(true)
      )
      .finally(() => setInitState(InitState.NeedAutoConnect))
  }, [initState])

  const cleanupAfterConnection = useCallback((walletClient?: WalletClient) => {
    // Close modals.
    setPickerModalOpen(false)
    setWalletConnectUri(undefined)
    setWalletEnableModalOpen(false)
    // Allow future enable requests to open the app.
    if (walletClient instanceof KeplrWalletConnectV1) {
      walletClient.dontOpenAppOnEnable = false
    }
    // No longer connecting a wallet.
    setConnectingWallet(undefined)
  }, [])

  // Wallet connect disconnect listeners.
  useEffect(() => {
    if (!walletConnect) return

    // Detect disconnected WC session and clear wallet state.
    walletConnect.on("disconnect", () => {
      console.log("WalletConnect disconnected.")
      setConnectedWallet(undefined)
      cleanupAfterConnection()
      setWalletConnect(undefined)
    })
  }, [cleanupAfterConnection, walletConnect])

  const disconnect = useCallback(async () => {
    setConnectedWallet(undefined)
    if (walletConnect?.connected) {
      await walletConnect.killSession()
    }
    setWalletConnect(undefined)
  }, [walletConnect, setConnectedWallet])

  const handleConnectionError = useCallback((error: unknown) => {
    console.error(error)
    setConnectionError(error)
  }, [])

  const enableAndSaveWallet = useCallback(
    async (
      wallet: Wallet,
      walletConnect?: WalletConnect,
      newWcSession?: boolean
    ) => {
      let walletClient
      try {
        walletClient = await wallet.getClient(walletConnect)
        if (walletClient) {
          setWalletEnableModalOpen(true)
          // Prevent double app open request.
          if (walletClient instanceof KeplrWalletConnectV1) {
            walletClient.dontOpenAppOnEnable = !!newWcSession
          }

          await enableWallet(wallet, walletClient)
          // If enable succeeds, save.
          setConnectedWallet({ wallet, client: walletClient })
        }
      } catch (err) {
        handleConnectionError(err)
      } finally {
        cleanupAfterConnection(walletClient)
      }
    },
    [cleanupAfterConnection, enableWallet, handleConnectionError]
  )

  const selectWallet = useCallback(
    async (wallet: Wallet) => {
      try {
        setConnectingWallet(wallet)
        setPickerModalOpen(false)
        await wallet.onSelect?.()

        if (wallet.isWalletConnect) {
          // Connect to WalletConnect.
          let _walletConnect = walletConnect
          if (!_walletConnect) {
            _walletConnect = new WalletConnect({
              bridge: "https://bridge.walletconnect.org",
              signingMethods: [
                "keplr_enable_wallet_connect_v1",
                "keplr_sign_amino_wallet_connect_v1",
              ],
              qrcodeModal: {
                open: (uri: string, cb: () => void) => {
                  // Open QR modal by setting URI.
                  setWalletConnectUri(uri)
                  onQrCloseCallback.current = cb
                },
                // Occurs on disconnect, which is handled elsewhere.
                close: () => console.log("qrcodeModal.close"),
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
            await enableAndSaveWallet(wallet, _walletConnect)
          } else {
            // Executes walletConnect's qrcodeModal.open.
            const currConnectionAttempt = ++connectionAttemptRef.current
            await _walletConnect.connect()

            // If another connection attempt is being made, don't try to
            // enable if connect finishes. This prevents double requests.
            if (connectionAttemptRef.current === currConnectionAttempt) {
              await enableAndSaveWallet(wallet, _walletConnect, true)
            }
          }
        } else {
          // No WalletConnect needed.
          await enableAndSaveWallet(wallet)
        }
      } catch (err) {
        handleConnectionError(err)
      } finally {
        cleanupAfterConnection()
      }
    },
    [
      walletConnectClientMeta,
      enableAndSaveWallet,
      handleConnectionError,
      cleanupAfterConnection,
      walletConnect,
    ]
  )

  const connect = useCallback(() => {
    setConnectionError(undefined)

    const skipModalWallet = isMobileWeb
      ? MobileWebWallet
      : // If only one wallet is available, skip the modal and use it.
      wallets.length === 1
      ? wallets[0]
      : // If provided a preselected wallet ID, use it if a
        // wallet exists with that ID.
        wallets.find(({ id }) => id === preselectedWalletId)
    if (skipModalWallet) {
      selectWallet(skipModalWallet)
      return
    }

    // If no default wallet, open modal to choose one.
    setPickerModalOpen(true)
  }, [preselectedWalletId, isMobileWeb, wallets, selectWallet])

  // Reset connection when it gets stuck somewhere.
  const [resetting, setResetting] = useState(false)
  const [selectWalletUponReset, setSelectWalletUponReset] = useState<Wallet>()
  // Reset once no longer connecting to a wallet but we have set a
  // wallet to select.
  useEffect(() => {
    if (resetting && !connectingWallet && selectWalletUponReset) {
      setResetting(false)
      setSelectWalletUponReset(undefined)
      setConnectionError(undefined)
      selectWallet(selectWalletUponReset)
    }
  }, [connectingWallet, resetting, selectWallet, selectWalletUponReset])
  // Initiate reset.
  const reset = useCallback(async () => {
    setResetting(true)
    await disconnect().catch(console.error)
    // Try resetting all wallet state and reconnecting.
    if (connectingWallet) {
      setSelectWalletUponReset(connectingWallet)
      cleanupAfterConnection()
    } else {
      // If no wallet to reconnect to, just reload.
      window.location.reload()
    }
  }, [cleanupAfterConnection, connectingWallet, disconnect, setResetting])

  // Attempt auto-connect if set or if in mobile web.
  useEffect(() => {
    if (initState !== InitState.NeedAutoConnect) return
    setInitState(InitState.Ready)

    if (attemptAutoConnect || isMobileWeb) connect()
  }, [attemptAutoConnect, initState, connect, isMobileWeb])

  return (
    <WalletManagerContext.Provider
      value={{
        connect,
        disconnect,
        connectedWallet,
        connectionError,
        isMobileWeb,
      }}
    >
      {children}

      <SelectWalletModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={!resetting && pickerModalOpen}
        onClose={() => setPickerModalOpen(false)}
        selectWallet={selectWallet}
        wallets={wallets}
      />
      <WalletConnectModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={!resetting && !!walletConnectUri}
        onClose={() => disconnect().finally(cleanupAfterConnection)}
        reset={reset}
        uri={walletConnectUri}
      />
      <EnablingWalletModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={!resetting && walletEnableModalOpen}
        onClose={() => setWalletEnableModalOpen(false)}
        renderLoader={renderLoader}
        reset={reset}
      />
      <BaseModal
        classNames={classNames}
        isOpen={resetting}
        maxWidth="24rem"
        title="Resetting..."
      >
        {renderLoader?.()}
      </BaseModal>
    </WalletManagerContext.Provider>
  )
}
