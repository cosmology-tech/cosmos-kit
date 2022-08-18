import '../styles/globals.css'

import { GasPrice } from '@cosmjs/stargate'
import { WalletManagerProvider } from '@cosmos-kit/react'
import { assets, chains } from 'chain-registry'
import type { AppProps } from 'next/app'
import React from 'react'

const LOCAL_STORAGE_KEY = 'connectedWalletId'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <WalletManagerProvider
    walletConnectClientMeta={{
      name: 'CosmosKitExampleDApp',
      description: 'A dApp using the @cosmos-kit/react library.',
      url: 'https://github.com/cosmology-tech/cosmos-kit/tree/main/packages/react',
      // @cosmology-tech's GitHub avatar
      icons: ['https://avatars.githubusercontent.com/u/101243801?s=200&v=4'],
    }}
    renderLoader={() => <p>Loading...</p>}
    localStorageKey={LOCAL_STORAGE_KEY}
    defaultChainName={'juno'}
    getSigningCosmWasmClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        '0.0025' + chainInfo.chain.fees?.fee_tokens?.[0]?.denom
      ),
    })}
    getSigningStargateClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        '0.0025' + chainInfo.chain.fees?.fee_tokens?.[0]?.denom
      ),
    })}
    chainInfo={{
      assets,
      chains,
    }}
  >
    <Component {...pageProps} />
  </WalletManagerProvider>
)

export default MyApp
