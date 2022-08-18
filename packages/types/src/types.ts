import { AssetList, Chain } from '@chain-registry/types'
import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate'
import { OfflineSigner } from '@cosmjs/proto-signing'
import {
  SigningStargateClient,
  SigningStargateClientOptions,
} from '@cosmjs/stargate'
import { ChainInfo } from '@keplr-wallet/types'
import WalletConnect from '@walletconnect/client'
import { IClientMeta } from '@walletconnect/types'

export interface ChainRegistryInfo {
  chains: Chain[]
  assets: AssetList[]
}
export interface CosmosWalletConfig {
  // Wallets available for connection. If undefined, uses `Wallets`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enabledWallets: Wallet<any>[]
  // Chain Name to initially connect to and selected by default if nothing
  // is passed to the hook. Must be present in one of the objects in
  // `chainInfoList`.
  defaultChainName: string
  // chain-registry info
  chainInfo: ChainRegistryInfo
  // Descriptive info about the webapp which gets displayed when enabling a
  // WalletConnect wallet (e.g. name, image, etc.).
  walletConnectClientMeta?: IClientMeta
  // When set to a valid wallet ID (from the `id` field of wallets in the
  // `enabledWallets` prop), the connect function will skip the selection modal
  // and attempt to connect to this wallet immediately.
  preselectedWalletId?: string
  // localStorage key for saving, loading, and auto connecting to a wallet.
  localStorageKey?: string
  // Getter for options passed to SigningCosmWasmClient on connection.
  getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>
  // Getter for options passed to SigningStargateClient on connection.
  getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>
}

// Make `enabledWallets` optional and default to `Wallets`.
export type CosmosWalletInitializeConfig = Omit<
  CosmosWalletConfig,
  'enabledWallets'
> &
  Partial<Pick<CosmosWalletConfig, 'enabledWallets'>>

export interface CosmosWalletState {
  // URI to display the WalletConnect QR Code.
  walletConnectQrUri?: string
  // Connected wallet info and clients for interacting with the chain.
  connectedWallet?: ConnectedWallet
  // Wallet currently being connected to (selected in picker but has not yet
  // been fully enabled).
  connectingWallet?: Wallet
  // Status.
  status: CosmosWalletStatus
  // Error encountered during the connection process.
  error?: unknown

  // chain-registry info
  chainInfo: ChainRegistryInfo
  // Getter for options passed to SigningCosmWasmClient on connection.
  // This is passed through from the provider props to allow composition
  // of your own hooks, and for use in the built-in useWallet hook.
  getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>
  // Getter for options passed to SigningStargateClient on connection.
  // This is passed through from the provider props to allow composition
  // of your own hooks, and for use in the built-in useWallet hook.
  getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>
  // Wallets available for connection.
  enabledWallets: Wallet[]
}

export type CosmosWalletStateObserver = (state: CosmosWalletState) => void

// TODO: Move imageUrl, and maybe name/description, to user configuration somehow, or incorporate in planned configurable UI overhaul.
export interface Wallet<Client = unknown> {
  // A unique identifier among all wallets.
  id: string
  // The name of the wallet.
  name: string
  // A description of the wallet.
  description: string
  // The URL of the wallet logo.
  imageUrl: string
  // If this wallet needs WalletConnect to establish client connection.
  isWalletConnect: boolean
  // WalletConnect app deeplink formats, with {{uri}} replaced with the
  // connection URI.
  walletConnectDeeplinkFormats?: DeeplinkFormats
  // WalletConnect client signing methods.
  walletConnectSigningMethods?: string[]
  // A function that returns an instantiated wallet client, with `walletConnect`
  // and `newWalletConnectSession` passed if `isWalletConnect === true`.
  getClient: (
    chainInfo: ChainInfo,
    walletConnect?: WalletConnect,
    newWalletConnectSession?: boolean
  ) => Promise<Client | undefined>
  // A function that returns the function to retrieve the `OfflineSigner` for
  // this wallet.
  getOfflineSignerFunction: (
    client: Client
  ) => (chainId: string) => OfflineSigner | Promise<OfflineSigner>
  // A function that enables the client.
  enableClient: (client: Client, chainInfo: ChainInfo) => Promise<void>
  // A function that is called after a connection attempt completes. Will fail
  // silently if an error is thrown.
  cleanupClient?: (client: Client) => Promise<void>
  // A function that returns the wallet name and address from the client.
  getNameAddress: (
    client: Client,
    chainInfo: ChainInfo
  ) => Promise<{ name: string; address: string }>
  // A function that determines if this wallet should automatically be connected
  // on initialization.
  shouldAutoconnect?: () => boolean | Promise<boolean>
  // A function that will execute the passed listener when the wallet connection
  // data needs to be refreshed. This will likely be used when the user switches
  // accounts in the wallet, and the name and address need to be updated. Called
  // on successful wallet connection.
  addRefreshListener?: (listener: () => void) => void
  // A function that will remove the refresh listener added previously. Called
  // on wallet disconnect.
  removeRefreshListener?: (listener: () => void) => void
}

export interface ConnectedWallet<Client = unknown> {
  // Wallet.
  wallet: Wallet<Client>
  // Wallet client.
  walletClient: Client
  // Chain info the clients are connected to.
  chainInfo: ChainInfo
  // Offline signer for the wallet client.
  offlineSigner: OfflineSigner
  // User's name for their wallet.
  name: string
  // Wallet address.
  address: string
  // Signing client for interacting with CosmWasm chain APIs.
  signingCosmWasmClient: SigningCosmWasmClient
  // Signing client for interacting with Stargate chain APIs.
  signingStargateClient: SigningStargateClient
}

export type SigningClientGetter<T> = (
  chainInfo: ChainInfo
) => T | Promise<T | undefined> | undefined

export type ChainInfoOverrides =
  | ChainInfo[]
  | (() => undefined | ChainInfo[] | Promise<undefined | ChainInfo[]>)

export enum CosmosWalletStatus {
  Uninitialized,
  // Don't call connect until this state is reached.
  Disconnected,
  Connecting,
  ChoosingWallet,
  PendingWalletConnect,
  EnablingWallet,
  Connected,
  Errored,
}

export interface DeeplinkFormats {
  ios: string
  android: string
}
