import { getConnectedWalletInfo, getKeplrChainInfo } from '@cosmos-kit/core'
import { ConnectedWallet, CosmosKitStatus } from '@cosmos-kit/types'
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

export const useWallet = (chainName?: string): UseWalletResponse => {
  const {
    status: managerStatus,
    error: managerError,
    connectedWallet: managerConnectedWallet,
    chainInfo,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
  } = useWalletManager()

  const [chainIdStatus, setChainIdStatus] = useState<CosmosKitStatus>(
    CosmosKitStatus.Uninitialized
  )
  const [chainIdError, setChainIdError] = useState<unknown>()
  const [chainIdConnectedWallet, setChainIdConnectedWallet] =
    useState<ConnectedWallet>()
  useEffect(() => {
    if (
      managerStatus !== CosmosKitStatus.Connected ||
      !managerConnectedWallet ||
      !chainName
    ) {
      // If the initial wallet client is not yet connected, this chainId
      // cannot be connected to yet and is thus still initializing.
      setChainIdStatus(CosmosKitStatus.Uninitialized)
      setChainIdConnectedWallet(undefined)
      setChainIdError(undefined)
      return
    }

    const connect = async () => {
      setChainIdStatus(CosmosKitStatus.Connecting)
      setChainIdError(undefined)

      const keplrChainInfo = await getKeplrChainInfo(chainName, chainInfo)

      setChainIdConnectedWallet(
        // TODO: Cache
        await getConnectedWalletInfo(
          managerConnectedWallet.wallet,
          managerConnectedWallet.walletClient,
          keplrChainInfo,
          await getSigningCosmWasmClientOptions?.(keplrChainInfo),
          await getSigningStargateClientOptions?.(keplrChainInfo)
        )
      )
      setChainIdStatus(CosmosKitStatus.Connected)
    }

    connect().catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      setChainIdError(error)
      setChainIdStatus(CosmosKitStatus.Errored)
    })
  }, [
    managerStatus,
    managerConnectedWallet,
    chainName,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
    chainInfo,
  ])

  const status = chainName ? chainIdStatus : managerStatus
  const connected = status === CosmosKitStatus.Connected
  const error = chainName ? chainIdError : managerError
  const connectedWallet = chainName
    ? chainIdConnectedWallet
    : managerConnectedWallet

  return { status, connected, error, ...connectedWallet }
}
