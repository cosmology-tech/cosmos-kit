import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClientOptions } from '@cosmjs/stargate'
import {
  ChainInfo,
  ConnectedWallet,
  Wallet,
  WalletAdapter,
} from '@cosmos-kit/types'

export const getConnectedWalletInfo = async <Client = unknown>(
  wallet: Wallet<Client>,
  adapter: WalletAdapter<Client>,
  client: Client,
  chainInfo: ChainInfo,
  signingCosmWasmClientOptions?: SigningCosmWasmClientOptions,
  signingStargateClientOptions?: SigningStargateClientOptions
): Promise<ConnectedWallet> => {
  await adapter.enableClient(client)

  // Parallelize for efficiency.
  const [{ name, address }, offlineSigner] = await Promise.all([
    // Get name and address.
    adapter.getNameAddress(),
    // Get offline signer.
    adapter.getOfflineSigner(),
  ])

  const [signingCosmWasmClient, signingStargateClient] = await Promise.all([
    // Get CosmWasm client.
    await (
      await import('@cosmjs/cosmwasm-stargate')
    ).SigningCosmWasmClient.connectWithSigner(
      adapter.getRpcEndpoint(),
      offlineSigner,
      signingCosmWasmClientOptions
    ),
    // Get Stargate client.
    await (
      await import('@cosmjs/stargate')
    ).SigningStargateClient.connectWithSigner(
      adapter.getRpcEndpoint(),
      offlineSigner,
      signingStargateClientOptions
    ),
  ])

  if (address === undefined) {
    throw new Error('Failed to retrieve wallet address.')
  }

  return {
    wallet,
    adapter,
    walletClient: client,
    chainInfo,
    offlineSigner,
    name,
    address,
    signingCosmWasmClient,
    signingStargateClient,
  }
}
