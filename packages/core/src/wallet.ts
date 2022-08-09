import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClientOptions } from '@cosmjs/stargate'
import { ChainInfo, Keplr } from '@keplr-wallet/types'

import { IKeplrWalletConnectV1, ConnectedWallet, Wallet } from './types'

// TODO: Move imageUrl, and maybe name/description, to user configuration somehow, or incorporate in planned configurable UI overhaul.

export const KeplrWallet: Wallet<Keplr> = {
  id: 'keplr',
  name: 'Keplr Wallet',
  description: 'Keplr Chrome Extension',
  imageUrl: '/keplr-wallet-extension.png',
  isWalletConnect: false,
  getClient: async () =>
    (await import('@keplr-wallet/stores')).getKeplrFromWindow(),
  getOfflineSignerFunction: (client) =>
    // This function expects to be bound to the `client` instance.
    client.getOfflineSignerAuto.bind(client),
  enableClient: async (client, chainInfo) => {
    // Only Keplr browser extension supports suggesting chain.
    if (client.mode === 'extension') {
      await client.experimentalSuggestChain(chainInfo)
    }
    return await client.enable(chainInfo.chainId)
  },
  getNameAddress: (client, chainInfo) =>
    client.getKey(chainInfo.chainId).then((key) => ({
      name: key.name,
      address: key.bech32Address,
    })),
  // Autoselect this wallet if in Keplr's in-app browser interface, since the
  // Keplr client is already provided/connected.
  shouldAutoselect: async () =>
    import('@keplr-wallet/stores')
      .then(({ getKeplrFromWindow }) => getKeplrFromWindow())
      .then((keplr) => !!keplr && keplr.mode === 'mobile-web')
      .catch(() => false),
}

export const WalletConnectKeplrWallet: Wallet<IKeplrWalletConnectV1> = {
  id: 'walletconnect-keplr',
  name: 'WalletConnect',
  description: 'Keplr Mobile',
  imageUrl: '/walletconnect-keplr.png',
  isWalletConnect: true,
  walletConnectDeeplinkFormat: {
    ios: 'keplrwallet://wcV1?{{uri}}',
    android:
      'intent://wcV1?{{uri}}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
  },
  getClient: async (chainInfo, walletConnect, newWalletConnectSession) => {
    if (walletConnect?.connected) {
      const client = new (
        await import('./connectors/walletconnect-keplr')
      ).KeplrWalletConnectV1(walletConnect, [chainInfo])
      // Prevent double app open request. See comment in
      // `walletconnect-keplr.ts` for more details.
      client.dontOpenAppOnEnable = !!newWalletConnectSession
      return client
    }
    throw new Error('Mobile wallet not connected.')
  },
  cleanupClient: async (client) => {
    // Allow future enable requests to open the app. See comment in
    // `walletconnect-keplr.ts` for more details.
    client.dontOpenAppOnEnable = false
  },
  // WalletConnect only supports Amino signing.
  getOfflineSignerFunction: (client) =>
    // This function expects to be bound to the `client` instance.
    client.getOfflineSignerOnlyAmino.bind(client),
  enableClient: (client, chainInfo) => client.enable(chainInfo.chainId),
  getNameAddress: (client, chainInfo) =>
    client.getKey(chainInfo.chainId).then((key) => ({
      name: key.name,
      address: key.bech32Address,
    })),
}

export const Wallets: Wallet[] = [KeplrWallet, WalletConnectKeplrWallet]

export const getConnectedWalletInfo = async <Client = any>(
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
