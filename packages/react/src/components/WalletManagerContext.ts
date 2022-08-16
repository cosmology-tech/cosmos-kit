import { getChainInfo, getConnectedWalletInfo } from '@cosmos-kit/core'
import { ConnectedWallet, CosmosWalletStatus } from '@cosmos-kit/types'
import { ChainInfo } from '@keplr-wallet/types'
import { createContext, useContext, useEffect, useState } from 'react'

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
  const {
    status: managerStatus,
    error: managerError,
    connectedWallet: managerConnectedWallet,
    chainInfoOverrides,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
  } = useWalletManager()

  const [chainIdStatus, setChainIdStatus] = useState<CosmosWalletStatus>(
    CosmosWalletStatus.Uninitialized
  )
  const [chainIdError, setChainIdError] = useState<unknown>()
  const [chainIdConnectedWallet, setChainIdConnectedWallet] =
    useState<ConnectedWallet>()
  useEffect(() => {
    if (
      managerStatus !== CosmosWalletStatus.Connected ||
      !managerConnectedWallet ||
      !chainId
    ) {
      // If the initial wallet client is not yet connected, this chainId
      // cannot be connected to yet and is thus still initializing.
      setChainIdStatus(CosmosWalletStatus.Uninitialized)
      setChainIdConnectedWallet(undefined)
      setChainIdError(undefined)
      return
    }

    const connect = async () => {
      setChainIdStatus(CosmosWalletStatus.Connecting)
      setChainIdError(undefined)

      const chainInfo = await getChainInfo(chainId, chainInfoOverrides)

      setChainIdConnectedWallet(
        // TODO: Cache
        await getConnectedWalletInfo(
          managerConnectedWallet.wallet,
          managerConnectedWallet.walletClient,
          chainInfo,
          await getSigningCosmWasmClientOptions?.(chainInfo),
          await getSigningStargateClientOptions?.(chainInfo)
        )
      )
      setChainIdStatus(CosmosWalletStatus.Connected)
    }

    connect().catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      setChainIdError(error)
      setChainIdStatus(CosmosWalletStatus.Errored)
    })
  }, [
    managerStatus,
    managerConnectedWallet,
    chainId,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
    chainInfoOverrides,
  ])

  const status = chainId ? chainIdStatus : managerStatus
  const connected = status === CosmosWalletStatus.Connected
  const error = chainId ? chainIdError : managerError
  const connectedWallet = chainId
    ? chainIdConnectedWallet
    : managerConnectedWallet

  return { status, connected, error, ...connectedWallet }
}
