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
  disconnect: () => void | Promise<void>
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
  renderEnablingKeplrModalContent?: () => ReactNode
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
  renderEnablingKeplrModalContent,
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

  const hideAllModals = useCallback(() => {
    setPickerModalOpen(false)
    setWalletConnectUri(undefined)
  }, [setPickerModalOpen, setWalletConnectUri])

  const disconnect = useCallback(() => {
    if (walletConnect?.connected) {
      walletConnect.killSession()
    }
    setWalletConnect(undefined)
    setConnectedWallet(undefined)
  }, [walletConnect, setConnectedWallet])

  // Wallet connect event listeners.
  useEffect(() => {
    if (!walletConnect) return

    // Detect disconnected WC session and clear wallet state.
    walletConnect.on("disconnect", () => {
      console.log("WalletConnect disconnected.")
      setConnectedWallet(undefined)
      hideAllModals()
    })
  }, [hideAllModals, walletConnect])

  const selectWallet = useCallback(
    async (wallet: Wallet) => {
      try {
        setPickerModalOpen(false)
        await wallet.onSelect?.()

        const get = async (
          connector?: WalletConnect,
          newWcSession?: boolean
        ) => {
          const walletClient = await wallet.getClient(connector)
          if (walletClient) {
            // SETUP ENABLE
            setKeplrEnableModalOpen(true)
            // Prevent double app open request.
            if (newWcSession && walletClient instanceof KeplrWalletConnectV1) {
              walletClient.dontOpenAppOnEnable = true
            }

            try {
              // ENABLE
              await enableKeplr(wallet, walletClient)
            } finally {
              // CLEANUP ENABLE

              // Allow future enable requests to open the app.
              if (
                newWcSession &&
                walletClient instanceof KeplrWalletConnectV1
              ) {
                walletClient.dontOpenAppOnEnable = false
              }

              setKeplrEnableModalOpen(false)
            }

            setConnectedWallet({ wallet, client: walletClient })
          }

          return walletClient
        }

        // Connect to WalletConnect.
        if (wallet.isWalletConnect) {
          const wcConnector = new WalletConnect({
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
          setWalletConnect(wcConnector)

          if (wcConnector.connected) {
            return await get(wcConnector)
          } else {
            // Attempt [re]connection of WalletConnect.
            await wcConnector.createSession()

            return await new Promise((resolve, reject) => {
              wcConnector.on("connect", (error) => {
                if (error) {
                  reject(error)
                } else {
                  get(wcConnector, true).then(resolve).catch(reject)
                }
              })
            })
          }
        } else {
          // No WalletConnect needed.
          return await get()
        }
      } catch (err) {
        console.error(err)
        setConnectionError(err)
      } finally {
        // Hide WC modal.
        setWalletConnectUri(undefined)
      }
    },
    [
      setPickerModalOpen,
      clientMeta,
      enableKeplr,
      setWalletConnectUri,
      setKeplrEnableModalOpen,
      setConnectedWallet,
      setWalletConnect,
      setConnectionError,
      onQrCloseCallback,
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

  // Attempt auto-connect if set.
  useEffect(() => {
    if (state !== State.NeedAutoConnect) return
    setState(State.Ready)

    if (attemptAutoConnect) connect()
  }, [attemptAutoConnect, state, connect])

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
        isOpen={pickerModalOpen}
        onClose={() => setPickerModalOpen(false)}
        selectWallet={selectWallet}
        wallets={wallets}
      />
      <WalletConnectModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={!!walletConnectUri}
        onClose={() => setWalletConnectUri(undefined)}
        uri={walletConnectUri}
      />
      <EnablingKeplrModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={keplrEnableModalOpen}
        onClose={() => setKeplrEnableModalOpen(false)}
        renderContent={renderEnablingKeplrModalContent}
        // Sometimes it thinks WalletConnect is still connected, but it
        // isn't. Forcibly disconnect here on reset to clear it.
        reset={() => {
          disconnect()
          window.location.reload()
        }}
      />
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
