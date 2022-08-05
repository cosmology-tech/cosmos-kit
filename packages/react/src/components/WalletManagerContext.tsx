import { ChainInfo } from '@keplr-wallet/types'
import { createContext, useContext, useEffect } from 'react'

import { IWalletManagerContext, UseWalletResponse } from '../types'

export const WalletManagerContext = createContext<IWalletManagerContext | null>(
  null
)

export const useWalletManager = () => {
  const context = useContext(WalletManagerContext)
  if (!context) {
    throw new Error('You forgot to use WalletManagerProvider.')
  }

  return context
}

export const useWallet = (
  chainId?: ChainInfo['chainId']
): UseWalletResponse => {
  const { state, send } = useWalletManager()
  const { connectedWallets } = state.context

  const providedChainId = Boolean(chainId)

  useEffect(() => {
    if (state.matches('connected') && providedChainId) {
      send('CONNECT_ADDITIONAL_CHAIN', { chainId })
    }
  }, [state.matches('connected'), providedChainId, chainId])

  const connecting =
    state.matches('enabling') ||
    state.matches('selecting') ||
    state.matches('connecting') ||
    (providedChainId && state.matches('connecting.enabling'))
  const connected = providedChainId
    ? state.matches('connected.enabled')
    : state.matches('connected')
  const error = JSON.stringify(state.value).includes('errored')
    ? state.context.error
    : undefined
  const connectedWallet = providedChainId
    ? connectedWallets[chainId]
    : connectedWallets.default

  return Object.assign({ connected, connecting, error }, connectedWallet || {})
}
