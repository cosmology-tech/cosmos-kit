import WalletConnect from "@walletconnect/client"
import { IClientMeta } from "@walletconnect/types"
import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { KeplrWalletConnectV1 } from "../providers"
import {
  BaseModal,
  EnablingKeplrModal,
  ModalClassNames,
  SelectWalletModal,
  WalletConnectModal,
} from "."
import { Wallet, WalletClient } from "./common"

interface ConnectedWallet {
  wallet: Wallet
  client: WalletClient
}

enum State {
  NeedMobileWeb,
  NeedAutoConnect,
  Ready,
}

export const WalletManagerContext = createContext<{
  connect: () => void
  disconnect: () => Promise<void>
  connectedWallet?: ConnectedWallet
  connectionError?: unknown
  isMobileWeb: boolean
} | null>(null)

export enum Event {
  WalletSelected = "wallet_selected",
}

// Causes SSR issues if importing this package directly... idk why
const getKeplrFromWindow = async () =>
  (await import("@keplr-wallet/stores")).getKeplrFromWindow()

const MobileWebWallet: Wallet = {
  id: "mobile-web",
  name: "",
  description: "",
  logoImgUrl: "",
  getClient: getKeplrFromWindow,
  isWalletConnect: false,
}

interface WalletManagerProviderProps {
  wallets: Wallet[]
  enableKeplr: (
    wallet: Wallet,
    walletClient: WalletClient
  ) => Promise<void> | void
  children: ReactNode
  classNames?: ModalClassNames
  closeIcon?: ReactNode
  // Will skip the modal and connect to the wallet directly.
  preselectedWalletId?: string | undefined
  clientMeta?: IClientMeta
  attemptAutoConnect?: boolean
  renderLoader?: () => ReactNode
}

export const WalletManagerProvider: FunctionComponent<
  WalletManagerProviderProps
> = ({
  wallets,
  enableKeplr,
  children,
  classNames,
  closeIcon,
  preselectedWalletId,
  clientMeta,
  attemptAutoConnect,
  renderLoader,
}) => {
  const [pickerModalOpen, setPickerModalOpen] = useState(false)
  // If set, opens QR code modal.
  const [walletConnectUri, setWalletConnectUri] = useState<string>()
  const [keplrEnableModalOpen, setKeplrEnableModalOpen] = useState(false)
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
  const [state, setState] = useState<State>(State.NeedMobileWeb)
  // In case WalletConnect fails to load, we need to be able to retry.
  // This is done through clicking reset on the WalletConnectModal.
  const [connectingWallet, setConnectingWallet] = useState<Wallet>()
  const connectionAttemptRef = useRef(0)

  // Detect if is inside Keplr mobile web, and set ready once checked.
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  useEffect(() => {
    if (state !== State.NeedMobileWeb) return

    getKeplrFromWindow()
      .then(
        (keplr) => keplr && keplr.mode === "mobile-web" && setIsMobileWeb(true)
      )
      .finally(() => setState(State.NeedAutoConnect))
  }, [state])

  const cleanupAfterConnection = useCallback((walletClient?: WalletClient) => {
    // Close modals.
    setPickerModalOpen(false)
    setWalletConnectUri(undefined)
    setKeplrEnableModalOpen(false)
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
          setKeplrEnableModalOpen(true)
          // Prevent double app open request.
          if (walletClient instanceof KeplrWalletConnectV1) {
            walletClient.dontOpenAppOnEnable = !!newWcSession
          }

          await enableKeplr(wallet, walletClient)
          // If enable succeeds, save.
          setConnectedWallet({ wallet, client: walletClient })
        }
      } catch (err) {
        handleConnectionError(err)
      } finally {
        cleanupAfterConnection(walletClient)
      }
    },
    [cleanupAfterConnection, enableKeplr, handleConnectionError]
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
              clientMeta,
            })
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
      clientMeta,
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
    if (state !== State.NeedAutoConnect) return
    setState(State.Ready)

    if (attemptAutoConnect || isMobileWeb) connect()
  }, [attemptAutoConnect, state, connect, isMobileWeb])

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
      <EnablingKeplrModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={!resetting && keplrEnableModalOpen}
        onClose={() => setKeplrEnableModalOpen(false)}
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

export const useWalletManager = () => {
  const context = useContext(WalletManagerContext)
  if (!context) {
    throw new Error("You forgot to use WalletManagerProvider")
  }

  return context
}
