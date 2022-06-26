import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from "@cosmjs/cosmwasm-stargate"
import { OfflineSigner } from "@cosmjs/proto-signing"
import {
  SigningStargateClient,
  SigningStargateClientOptions,
} from "@cosmjs/stargate"
import { ChainInfo, Keplr } from "@keplr-wallet/types"
import WalletConnect from "@walletconnect/client"

export interface IKeplrWalletConnectV1 extends Keplr {
  dontOpenAppOnEnable: boolean
}

export type WalletClient = Keplr | IKeplrWalletConnectV1

export enum WalletType {
  Keplr = "keplr",
  WalletConnectKeplr = "walletconnect_keplr",
}

export interface Wallet {
  // A unique identifier among all wallets.
  type: WalletType
  // The name of the wallet.
  name: string
  // A description of the wallet.
  description: string
  // The URL of the wallet logo.
  imageUrl: string
  // A function that returns an instantiated wallet client, with
  // `walletConnect` passed if `type === WalletType.WalletConnectKeplr`.
  getClient: (
    chainInfo: ChainInfo,
    walletConnect?: WalletConnect
  ) => Promise<WalletClient | undefined>
  // A function that returns the function to retrieve the `OfflineSigner`
  // for this wallet.
  getOfflineSignerFunction: (
    client: WalletClient
  ) => (chainId: string) => OfflineSigner | Promise<OfflineSigner>
}

export interface ConnectedWallet {
  // Wallet.
  wallet: Wallet
  // Wallet client.
  walletClient: WalletClient
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

export interface IWalletManagerContext {
  // Function to begin the connection process. This will either display
  // the wallet picker modal or immediately attempt to connect to a wallet
  // depending on the props passed to WalletManagerProvider.
  connect: () => void
  // Function that disconnects from the connected wallet.
  disconnect: () => Promise<void>
  // Connected wallet info and clients for interacting with the chain.
  connectedWallet?: ConnectedWallet
  // Status of cosmodal.
  status: WalletConnectionStatus
  // If status is WalletConnectionStatus.Connected.
  connected: boolean
  // Error encountered during the connection process.
  error?: unknown
  // If this app is running inside the Keplr Mobile web interface.
  isEmbeddedKeplrMobileWeb: boolean
  // List or getter of additional or replacement ChainInfo objects. These
  // will take precedent over internal definitions by comparing `chainId`.
  // This is passed through from the provider props to allow composition
  // of your own hooks, and for use in the built-in useWallet hook.
  chainInfoOverrides?: ChainInfoOverrides
  // Getter for options passed to SigningCosmWasmClient on connection.
  // This is passed through from the provider props to allow composition
  // of your own hooks, and for use in the built-in useWallet hook.
  getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>
  // Getter for options passed to SigningStargateClient on connection.
  // This is passed through from the provider props to allow composition
  // of your own hooks, and for use in the built-in useWallet hook.
  getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>
}

export interface ModalClassNames {
  modalContent?: string
  modalOverlay?: string
  modalHeader?: string
  modalSubheader?: string
  modalCloseButton?: string
  walletList?: string
  wallet?: string
  walletImage?: string
  walletInfo?: string
  walletName?: string
  walletDescription?: string
  textContent?: string
}

export enum WalletConnectionStatus {
  Initializing,
  AttemptingAutoConnection,
  // Don't call connect until this state is reached.
  ReadyForConnection,
  Connecting,
  Connected,
  Resetting,
  Errored,
}

export type UseWalletResponse = Partial<ConnectedWallet> &
  Pick<IWalletManagerContext, "status" | "connected" | "error">
