import { ChainInfo } from "@keplr-wallet/types"
import { createContext, useContext, useEffect, useState } from "react"

import {
  ConnectedWallet,
  IWalletManagerContext,
  UseWalletResponse,
  WalletConnectionStatus,
} from "../types"
import { getChainInfo, getConnectedWalletInfo } from "../utils"

export const WalletManagerContext = createContext<IWalletManagerContext | null>(
  null
)

export const useWalletManager = () => {
  const context = useContext(WalletManagerContext)
  if (!context) {
    throw new Error("You forgot to use WalletManagerProvider")
  }

  return context
}

export const useWallet = (
  chainId?: ChainInfo["chainId"]
): UseWalletResponse => {
  const {
    status: managerStatus,
    error: managerError,
    connectedWallet: managerConnectedWallet,
    chainInfoOverrides,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
  } = useWalletManager()

  const [chainIdStatus, setChainIdStatus] = useState<WalletConnectionStatus>(
    WalletConnectionStatus.Initializing
  )
  const [chainIdError, setChainIdError] = useState<unknown>()
  const [chainIdConnectedWallet, setChainIdConnectedWallet] =
    useState<ConnectedWallet>()
  useEffect(() => {
    if (
      managerStatus !== WalletConnectionStatus.Connected ||
      !managerConnectedWallet ||
      !chainId
    ) {
      // If the initial wallet client is not yet connected, this chainId
      // cannot be connected to yet and is thus still initializing.
      setChainIdStatus(WalletConnectionStatus.Initializing)
      setChainIdConnectedWallet(undefined)
      setChainIdError(undefined)
      return
    }

    const connect = async () => {
      setChainIdStatus(WalletConnectionStatus.Connecting)
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
      setChainIdStatus(WalletConnectionStatus.Connected)
    }

    connect().catch((error) => {
      console.error(error)
      setChainIdError(error)
      setChainIdStatus(WalletConnectionStatus.Errored)
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
  const error = chainId ? chainIdError : managerError
  const connectedWallet = chainId
    ? chainIdConnectedWallet
    : managerConnectedWallet

  return { status, error, ...connectedWallet }
}
