import { Keplr } from "@keplr-wallet/types"
import WalletConnect from "@walletconnect/client"
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

import { KeplrWalletConnectV1 } from "../providers"
import { ModalClassNames, SelectWalletModal, WalletConnectQRCodeModal } from "."

export type WalletClient = Keplr | KeplrWalletConnectV1

export interface WalletInfo {
  id: string
  name: string
  description: string
  logoImgUrl: string
  getWallet: (connector?: WalletConnect) => Promise<WalletClient | undefined>
}

export const WalletManagerContext = createContext<{
  getWallet: () => Promise<WalletClient | undefined>
  clearLastUsedWallet: () => void
  setDefaultConnectionType: (type: string | undefined) => void
  connectionType?: string | undefined
} | null>(null)

export enum Event {
  ModalClose = "modal_close",
  QrModalClose = "qr_modal_close",
}

export const WalletManagerProvider: FunctionComponent<{
  walletInfoList: WalletInfo[]
  children: ReactNode
  classNames?: ModalClassNames
  closeIcon?: ReactNode
}> = ({ walletInfoList, children, classNames, closeIcon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wcQrUri, setWcQrUri] = useState<string>()

  const lastUsedWalletRef = useRef<WalletClient>()
  const defaultConnectionTypeRef = useRef<string>()
  const [connectionType, setConnectionType] = useState<string>()
  const eventListener = useMemo(() => new EventEmitter(), [])

  const getWallet = useCallback(async (): Promise<WalletClient | undefined> => {
    if (typeof window === "undefined") {
      return
    }

    if (lastUsedWalletRef.current) {
      return lastUsedWalletRef.current
    }

    const cleanUp = () => {
      eventListener.off(Event.ModalClose)
      eventListener.off(Event.QrModalClose)
      walletInfoList.forEach((walletInfo) => {
        eventListener.off(walletInfo.id)
      })
    }

    let callbackClosed: (() => void) | undefined

    const wcConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      signingMethods: [
        "keplr_enable_wallet_connect_v1",
        "keplr_sign_amino_wallet_connect_v1",
      ],
      qrcodeModal: {
        open: (uri: string, cb: any) => {
          setWcQrUri(uri)
          callbackClosed = cb
        },
        close: () => setWcQrUri(undefined),
      },
    })

    const resolveWallet = async (walletInfo: WalletInfo) => {
      const wallet = await walletInfo.getWallet(wcConnector)
      lastUsedWalletRef.current = wallet
      setConnectionType(walletInfo.id)
      eventListener.off(Event.ModalClose)
      eventListener.off(Event.QrModalClose)
      return wallet
    }

    const defaultConnectionWalletInfo = walletInfoList.find(
      (walletInfo) => defaultConnectionTypeRef.current === walletInfo.id
    )
    if (defaultConnectionWalletInfo) {
      return resolveWallet(defaultConnectionWalletInfo)
    }

    return new Promise((resolve, reject) => {
      setIsModalOpen(true)

      eventListener.on(Event.ModalClose, () => {
        setIsModalOpen(false)
        reject()
        cleanUp()
      })

      eventListener.on(Event.QrModalClose, () => {
        setWcQrUri(undefined)
        callbackClosed?.()
      })

      walletInfoList.forEach((walletInfo) => {
        eventListener.on(walletInfo.id, async () => {
          setIsModalOpen(false)

          if (walletInfo.id.startsWith("walletconnect")) {
            if (!wcConnector.connected) {
              wcConnector.createSession()

              wcConnector.on("connect", (error) => {
                if (error) {
                  reject(error)
                } else {
                  resolve(resolveWallet(walletInfo))
                }
              })
            } else {
              resolve(resolveWallet(walletInfo))
            }
          } else {
            resolve(resolveWallet(walletInfo))
          }
        })
      })
    })
  }, [])

  return (
    <WalletManagerContext.Provider
      value={{
        getWallet,
        clearLastUsedWallet: useCallback(() => {
          lastUsedWalletRef.current = undefined
          setConnectionType(undefined)
        }, []),
        setDefaultConnectionType: useCallback((type: string | undefined) => {
          defaultConnectionTypeRef.current = type
        }, []),
        connectionType,
      }}
    >
      {children}

      <SelectWalletModal
        classNames={classNames}
        closeIcon={closeIcon}
        isOpen={isModalOpen}
        onClose={() => eventListener.emit(Event.ModalClose)}
        selectWallet={(walletId: string) => eventListener.emit(walletId)}
        wallets={walletInfoList}
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
