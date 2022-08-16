# @cosmos-kit/react

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/184277736-69fef40f-1991-4c0e-b979-da125cf7fd8f.svg" />
</p>


<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-kit/blob/main/packages/react/LICENSE"><img height="20" src="https://img.shields.io/badge/license-BSD%203--Clause%20Clear-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmos-kit/react"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-kit?filename=packages%2Fcore%2Fpackage.json"></a>
</p>

A wallet adapter for react with mobile WalletConnect support for the Cosmos
ecosystem.

## Setup

1. Install the package in your React project.

```sh
npm install --save @cosmos-kit/react
# OR
yarn add @cosmos-kit/react
```

2. Import `WalletManagerProvider` and wrap it around your whole app. Only
   include it once as an ancestor of all components that need to access the
   wallet. Likely you'll want this in your root App component. Check out the
   example code to see how to define wallets.

```tsx
import { ChainInfoID } from '@cosmos-kit/types'
import { WalletManagerProvider } from '@cosmos-kit/react'

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <WalletManagerProvider
    defaultChainId={ChainInfoID.Juno1}
    walletConnectClientMeta={{
      name: 'CosmosWalletExampleDApp',
      description: 'A dApp using the @cosmos-kit/react library.',
      url: 'https://github.com/cosmology-tech/cosmos-kit/tree/main/packages/react',
      // @cosmology-tech's GitHub avatar
      icons: ['https://avatars.githubusercontent.com/u/101243801?s=200&v=4'],
    }}
  >
    <Component {...pageProps} />
  </WalletManagerProvider>
)

export default MyApp
```

3. Manage the wallet by using the `useWalletManager` and `useWallet` hooks in
   your pages and components.

```tsx
import { CosmosWalletStatus } from '@cosmos-kit/types'
import { useWallet, useWalletManager } from '@cosmos-kit/react'

const Home: NextPage = () => {
  const { connect, disconnect } = useWalletManager()
  const { status, error, name, address, signingCosmWasmClient } = useWallet()

  return status === CosmosWalletStatus.Connected ? (
    <div>
      <p>
        Name: <b>{name}</b>
      </p>
      <p>
        Address: <b>{address}</b>
      </p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  ) : (
    <div>
      <button onClick={connect}>Connect</button>
      {error && <p>{error instanceof Error ? error.message : `${error}`}</p>}
    </div>
  )
}

export default Home
```

## API

Types are displayed below.

### WalletManagerProvider

This component takes the properties in `WalletManagerProviderProps`

### useWalletManager

```
() => IWalletManagerContext
```

This hook returns all relevant fields, but you will likely only use this to
`connect` and `disconnect`.

Returns `IWalletManagerContext`

### useWallet

```
(chainId?: ChainInfo["chainId"]) => UseWalletResponse
```

This hook is a subset of `useWalletManager`, returning the fields inside the
`connectedWallet` object, as well as `status` and `error`. It also takes an
optional `chainId`, which will instantiate clients for the desired chain once
the wallet is connected. This lets you seamlessly connect and use clients for
many different chains. If no `chainId` is passed, it will return the connection
info for the default chain (from the initial wallet connection via
`useWalletManager`'s `connect` function).

Returns `status`, `connected`, and `error` from `IWalletManagerContext`, as well
as optional versions of the fields inside `ConnectedWallet` (undefined if no
wallet is connected).

### Relevant types

```tsx
type UseWalletResponse = Partial<ConnectedWallet> &
  Pick<IWalletManagerContext, 'status' | 'error'>

interface ModalClassNames {
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

interface IClientMeta {
  description: string
  url: string
  icons: string[]
  name: string
}

interface ConnectedWallet<Client = unknown> {
  // Wallet.
  wallet: Wallet<Client>
  // Wallet client.
  walletClient: Client
  // Chain info the clients are connected to.
  chainInfo: ChainInfo
  // Offline signer for the wallet client.
  offlineSigner: OfflineSigner
  // Name of wallet.
  name: string
  // Wallet address.
  address: string
  // Signing client for interacting with CosmWasm chain APIs.
  signingCosmWasmClient: SigningCosmWasmClient
  // Signing client for interacting with Stargate chain APIs.
  signingStargateClient: SigningStargateClient
}

enum CosmosWalletStatus {
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

type SigningClientGetter<T> = (
  chainInfo: ChainInfo
) => T | Promise<T | undefined> | undefined

type ChainInfoOverrides =
  | ChainInfo[]
  | (() => undefined | ChainInfo[] | Promise<undefined | ChainInfo[]>)

interface IWalletManagerContext {
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
  // Function to begin the connection process. This will either display
  // the wallet picker modal or immediately attempt to connect to a wallet
  // depending on the props passed to WalletManagerProvider.
  connect: () => void
  // Function that disconnects from the connected wallet.
  disconnect: () => Promise<void>
  // If status is Connected.
  connected: boolean
}

interface WalletManagerProviderProps {
  // Wallets available for connection. If undefined, uses `Wallets` from
  // @cosmos-kit/registry.
  enabledWallets?: Wallet[]
  // Chain ID to initially connect to and selected by default if nothing
  // is passed to the hook. Must be present in one of the objects in
  // `chainInfoList`.
  defaultChainId: string
  // List or getter of additional or replacement ChainInfo objects. These
  // will take precedent over internal definitions by comparing `chainId`.
  chainInfoOverrides?: ChainInfoOverrides
  // Descriptive info about the webapp which gets displayed when enabling a
  // WalletConnect wallet (e.g. name, image, etc.).
  walletConnectClientMeta?: IClientMeta
  // When set to a valid wallet ID, the connect function will skip the
  // selection modal and attempt to connect to this wallet immediately.
  preselectedWalletId?: string
  // localStorage key for saving, loading, and auto connecting to a wallet.
  localStorageKey?: string
  // Getter for options passed to SigningCosmWasmClient on connection.
  getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>
  // Getter for options passed to SigningStargateClient on connection.
  getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>
  // Class names applied to various components for custom theming.
  classNames?: ModalClassNames
  // Custom close icon.
  closeIcon?: ReactNode
  // A custom loader to display in the modals, such as enabling the wallet.
  renderLoader?: () => ReactNode
}

interface Wallet<Client = unknown> {
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

interface DeeplinkFormats {
  ios: string
  android: string
}
```

## Local Testnet Configuration

To test against a Juno testnet running on your localhost pass the following
`chainInfoOverrides` prop to the `WalletManagagerProvider` component:

```
chainInfoOverrides={[
  {
    rpc: 'http://localhost:26657',
    rest: 'http://localhost:26657',
    chainId: ChainInfoID.Juno1,
    chainName: 'Juno Testnet',
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('juno'),
    currencies: [
      {
        coinDenom: 'junox',
        coinMinimalDenom: 'ujunox',
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'junox',
        coinMinimalDenom: 'ujunox',
        coinDecimals: 6,
      },
    ],
    stakeCurrency: {
      coinDenom: 'junox',
      coinMinimalDenom: 'ujunox',
      coinDecimals: 6,
    },
    gasPriceStep: {
      low: 0.03,
      average: 0.04,
      high: 0.05,
    },
    features: ['ibc-transfer', 'ibc-go'],
  },
]}
```

## Credits

Original work inspired by [cosmodal](https://github.com/chainapsis/cosmodal).
