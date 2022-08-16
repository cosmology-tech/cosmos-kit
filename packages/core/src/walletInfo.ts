import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClientOptions } from '@cosmjs/stargate'
import { ConnectedWallet, Wallet } from '@cosmos-kit/types'
import { ChainInfo } from '@keplr-wallet/types'

export const getConnectedWalletInfo = async <Client = unknown>(
  wallet: Wallet<Client>,
  client: Client,
  chainInfo: ChainInfo,
  signingCosmWasmClientOptions?: SigningCosmWasmClientOptions,
  signingStargateClientOptions?: SigningStargateClientOptions
): Promise<ConnectedWallet> => {
  await wallet.enableClient(client, chainInfo)

  // Parallelize for efficiency.
  const [{ name, address }, offlineSigner] = await Promise.all([
    // Get name and address.
    wallet.getNameAddress(client, chainInfo),
    // Get offline signer.
    wallet.getOfflineSignerFunction(client)(chainInfo.chainId),
  ])

  const [signingCosmWasmClient, signingStargateClient] = await Promise.all([
    // Get CosmWasm client.
    await (
      await import('@cosmjs/cosmwasm-stargate')
    ).SigningCosmWasmClient.connectWithSigner(
      chainInfo.rpc,
      offlineSigner,
      signingCosmWasmClientOptions
    ),
    // Get Stargate client.
    await (
      await import('@cosmjs/stargate')
    ).SigningStargateClient.connectWithSigner(
      chainInfo.rpc,
      offlineSigner,
      signingStargateClientOptions
    ),
  ])

  if (address === undefined) {
    throw new Error('Failed to retrieve wallet address.')
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
