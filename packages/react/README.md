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
npm install @cosmos-kit/react
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
    defaultChainName={'cosmoshub'}
    walletConnectClientMeta={{
      name: 'CosmosKitExampleDApp',
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
import { CosmosKitStatus } from '@cosmos-kit/types'
import { useWallet, useWalletManager } from '@cosmos-kit/react'

const Home: NextPage = () => {
  const { connect, disconnect } = useWalletManager()
  const { status, error, name, address, signingCosmWasmClient } = useWallet()

  return status === CosmosKitStatus.Connected ? (
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
(chainName?: string) => UseWalletResponse
```

This hook is a subset of `useWalletManager`, returning the fields inside the
`connectedWallet` object, as well as `status` and `error`. It also takes an
optional `chainName`, which will instantiate clients for the desired chain once
the wallet is connected. This lets you seamlessly connect and use clients for
many different chains. If no `chainName` is passed, it will return the connection
info for the default chain (from the initial wallet connection via
`useWalletManager`'s `connect` function).

Returns `status`, `connected`, and `error` from `IWalletManagerContext`, as well
as optional versions of the fields inside `ConnectedWallet` (undefined if no
wallet is connected).

## Local/Testnet Configuration

To test against any testnet running on your localhost pass the following
`chainInfo` prop to the `WalletManagagerProvider` component:

```js
const chain = {
  chain_name: "junolocalnet",
  status: "live",
  network_type: "localnet",
  pretty_name: "Juno Testnet",
  chain_id: "juno-1",
  bech32_prefix: "juno",
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "ujunox",
        low_gas_price: 0.03,
        average_gas_price: 0.04,
        high_gas_price: 0.05
      }
    ]
  },
  staking: {
    staking_tokens: [
      {
        denom: "ujunox"
      }
    ]
  },
  codebase: {
    cosmos_sdk_version: "0.45",
    tendermint_version: "0.34",
    cosmwasm_version: "0.28",
    cosmwasm_enabled: true
  },
  apis: {
    rpc: [
      {
        address: "http://localhost:26657"
      }
    ],
    rest: [
      {
        address: "http://localhost:26657"
      }
    ]
  }
};

const assets = {
  chain_name: "junolocalnet",
  assets: [
    {
      description: "The native token of JUNO Chain",
      denom_units: [
        {
          denom: "ujunox",
          exponent: 0
        },
        {
          denom: "junox",
          exponent: 6
        }
      ],
      base: "ujunox",
      name: "Junox",
      display: "junox",
      symbol: "JUNO",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.svg"
      }
    }
  ]
};
```

## Credits

Original work inspired by [cosmodal](https://github.com/chainapsis/cosmodal).
