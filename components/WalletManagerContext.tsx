import WalletConnect from "@walletconnect/client"
import { IClientMeta } from "@walletconnect/types"
import EventEmitter from "eventemitter3"
import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"

import { ModalClassNames, SelectWalletModal, WalletConnectQRCodeModal } from "."
import { Wallet, WalletClient } from "./common"

export const WalletManagerContext = createContext<{
  getWalletClient: () => Promise<WalletClient | undefined>
  setDefaultWalletId: (id: string | undefined) => void
  connectedWalletId?: string | undefined
} | null>(null)

export enum Event {
  ModalClose = "modal_close",
  QrModalClose = "qr_modal_close",
  WalletSelected = "wallet_selected",
}

interface WalletManagerProviderProps {
  wallets: Wallet[]
  children: ReactNode
  classNames?: ModalClassNames
  closeIcon?: ReactNode
  defaultWalletId?: string | undefined
  clientMeta?: IClientMeta
}

export const WalletManagerProvider: FunctionComponent<
  WalletManagerProviderProps
> = ({
  wallets,
  children,
  classNames,
  closeIcon,
  defaultWalletId,
  clientMeta,
}) => {
  const eventListener = useMemo(() => new EventEmitter(), [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  // If set, opens QR code modal.
  const [wcQrUri, setWcQrUri] = useState<string>()
  const defaultWalletIdRef = useRef<string | undefined>(
    // If only one wallet is available, use it as the default and skip
    // the modal.
    wallets.length === 1
      ? wallets[0].id
      : // If provided a default wallet ID, use it if a wallet exists with
        // that ID.
        wallets.find(({ id }) => id === defaultWalletId)?.id
  )
  const [connectedWalletId, setConnectedWalletId] = useState<string>()

  const getWalletClient = useCallback(async (): Promise<
    WalletClient | undefined
  > => {
    if (typeof window === "undefined") {
      return
    }

    const cleanUpAndClose = () => {
      setIsModalOpen(false)
      setWcQrUri(undefined)
      eventListener.off(Event.ModalClose)
      eventListener.off(Event.QrModalClose)
      eventListener.off(Event.WalletSelected)
    }

    // To call when closing QR code modal manually.
    let onCloseCallback: (() => void) | undefined

    const getClientForWallet = async (wallet: Wallet) => {
      try {
        return await new Promise<WalletClient | undefined>(
          (resolve, reject) => {
            const get = async (connector?: WalletConnect) => {
              const walletClient = await wallet.getClient(connector)
              setConnectedWalletId(wallet.id)
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
                    setWcQrUri(uri)
                    // To call when closing QR code modal manually.
                    onCloseCallback = cb
                  },
                  // On connect or disconnect, clean everything up.
                  close: cleanUpAndClose,
                },
                clientMeta,
              })

              // Handle manual close of QR code modal. This is an alternative
              // to responding to the connection request below, likely if
              // the user doesn't open the wallet at all and thus cannot
              // accept or reject. We don't want them stuck in the modal if
              // they don't have the mobile app or don't open it.
              eventListener.on(Event.QrModalClose, () => {
                onCloseCallback?.()
                reject()
              })

              if (wcConnector.connected) {
                resolve(get(wcConnector))
              } else {
                // Attempt [re]connection of WalletConnect.
                wcConnector.createSession()
                wcConnector.on("connect", (error) => {
                  if (error) {
                    reject(error)
                  } else {
                    resolve(get(wcConnector))
                  }
                })
              }
            } else {
              // No WalletConnect needed.
              resolve(get())
            }
          }
        )
      } finally {
        cleanUpAndClose()
      }
    }

    const defaultWallet = wallets.find(
      ({ id }) => defaultWalletIdRef.current === id
    )
    if (defaultWallet) {
      return getClientForWallet(defaultWallet)
    }

    try {
      setIsModalOpen(true)

      return await new Promise((resolve, reject) => {
        eventListener.on(Event.ModalClose, reject)
        eventListener.on(Event.WalletSelected, (wallet?: Wallet) => {
          if (!wallet) return reject(new Error("No wallet selected."))

          setIsModalOpen(false)
          resolve(getClientForWallet(wallet))
        })
      })
    } finally {
      cleanUpAndClose()
    }
  }, [])

  return (
    <WalletManagerContext.Provider
      value={{
        getWalletClient,
        setDefaultWalletId: useCallback((type: string | undefined) => {
          // Can only set connection type to given wallet info ID.
          if (!wallets.some(({ id }) => id === type)) return

          defaultWalletIdRef.current = type
        }, []),
        connectedWalletId: connectedWalletId,
      }}
    >
      {children}

      <SelectWalletModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={isModalOpen}
        onClose={() => eventListener.emit(Event.ModalClose)}
        selectWallet={(wallet) =>
          eventListener.emit(Event.WalletSelected, wallet)
        }
        wallets={wallets}
      />
      <WalletConnectQRCodeModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={!!wcQrUri}
        onClose={() => eventListener.emit(Event.QrModalClose)}
        uri={wcQrUri}
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
