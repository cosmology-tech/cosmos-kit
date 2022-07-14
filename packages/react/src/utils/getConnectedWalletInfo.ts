import { SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate"
import { SigningStargateClientOptions } from "@cosmjs/stargate"
import { ChainInfo } from "@keplr-wallet/types"

import { ConnectedWallet, Wallet, WalletClient, WalletType } from "../types"

export const getConnectedWalletInfo = async (
  wallet: Wallet,
  client: WalletClient,
  chainInfo: ChainInfo,
  signingCosmWasmClientOptions?: SigningCosmWasmClientOptions,
  signingStargateClientOptions?: SigningStargateClientOptions
): Promise<ConnectedWallet> => {
  // Only Keplr browser extension supports suggesting chain.
  // Not WalletConnect nor embedded Keplr Mobile web.
  if (wallet.type === WalletType.Keplr && client.mode !== "mobile-web") {
    await client.experimentalSuggestChain(chainInfo)
  }

  await client.enable(chainInfo.chainId)

  // Parallelize for efficiency.
  const [{ name, bech32Address: address }, offlineSigner] = await Promise.all([
    // Get name.
    client.getKey(chainInfo.chainId),
    // Get offline signer.
    wallet.getOfflineSignerFunction(client)(chainInfo.chainId),
  ])

  const [signingCosmWasmClient, signingStargateClient] = await Promise.all([
    // Get CosmWasm client.
    await (
      await import("@cosmjs/cosmwasm-stargate")
    ).SigningCosmWasmClient.connectWithSigner(
      chainInfo.rpc,
      offlineSigner,
      signingCosmWasmClientOptions
    ),
    // Get Stargate client.
    await (
      await import("@cosmjs/stargate")
    ).SigningStargateClient.connectWithSigner(
      chainInfo.rpc,
      offlineSigner,
      signingStargateClientOptions
    ),
  ])

  if (address === undefined) {
    throw new Error("Failed to retrieve wallet address.")
  }

  return {
    wallet,
    walletClient: client,
    chainInfo,
    offlineSigner,
    name,
    address,
    signingCosmWasmClient,
    signingStargateClient,
  }
}
