import { isMobile } from '@walletconnect/browser-utils'
import { WalletType } from '../types'
import type { WalletMachineContextType, WalletMachineEvent } from './types'

export const shouldSelectWalletConnectMobile = (
  _,
  event: WalletMachineEvent
) => {
  const walletType = 'walletType' in event && event.walletType

  return isMobile() && walletType === WalletType.WalletConnectKeplr
}

export const shouldSelectWalletConnect = (_, event: WalletMachineEvent) => {
  const walletType = 'walletType' in event && event.walletType

  return walletType === WalletType.WalletConnectKeplr
}

export const shouldSelectWalletExtension = (_, event: WalletMachineEvent) => {
  const walletType = 'walletType' in event && event.walletType

  return (
    walletType === WalletType.Keplr ||
    ('isEmbeddedKeplrMobileWeb' in event && event.isEmbeddedKeplrMobileWeb)
  )
}

export const shouldHaveWalletConnectReadyForConnecting = (
  context: WalletMachineContextType
) => Boolean(context.walletConnectUri && context.walletConnect)

export const shouldHaveWalletConnectUri = (context: WalletMachineContextType) =>
  Boolean(context.walletConnectUri)

export const isConnectedToWalletExtension = (
  context: WalletMachineContextType
) => context.walletType === WalletType.Keplr
