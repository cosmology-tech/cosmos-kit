import { createContext, ReactNode, useState } from 'react'

import { Dispatch, WalletModalProps } from '../core/types'
import { WalletManager } from '../core/wallet-manager'
import { WalletModal as defaultWalletModal } from './modal'

export const walletContext = createContext<{
  walletManager: WalletManager
  setOpenModal: Dispatch<boolean>
} | null>(null)

export const WalletProvider = ({
  // chainSelector,
  walletModal,
  walletManager,
  children,
}: {
  // chainSelector?: ({ name, setName, chainOptions }: ChainSelectorProps) => JSX.Element;
  walletModal?: ({
    open,
    setOpen,
    walletOptions,
  }: WalletModalProps) => JSX.Element
  walletManager: WalletManager
  children: ReactNode
}) => {
  const [openModal, setOpenModal] = useState(false)
  const walletOptions = walletManager.walletInfos.map(
    ({ name, logo, prettyName, describe }) => ({
      id: name,
      logo,
      title: prettyName,
      describe,
      onClick: async () => {
        walletManager.setCurrentWallet(name)
        await walletManager.connect()
      },
    })
  )

  // walletManager.connect = () => setOpenModal(true);
  const Modal = walletModal || defaultWalletModal

  return (
    <walletContext.Provider
      value={{
        walletManager,
        setOpenModal,
      }}
    >
      {children}
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        walletOptions={walletOptions}
      />
    </walletContext.Provider>
  )
}
