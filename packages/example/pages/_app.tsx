import '../styles/globals.css'

import { GasPrice } from '@cosmjs/stargate'
import { AllWallets, ChainInfoID } from '@cosmos-wallet/core'
import { WalletManagerProvider } from '@cosmos-wallet/react'
import type { AppProps } from 'next/app'
import React from 'react'

const LOCAL_STORAGE_KEY = 'connectedWalletId'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <WalletManagerProvider
    walletConnectClientMeta={{
      name: 'CosmodalExampleDApp',
      description: 'A dApp using the @noahsaso/cosmodal library.',
      url: 'https://noahsaso-cosmodal.vercel.app',
      icons: ['https://moonphase.is/image.svg'],
    }}
    enabledWallets={AllWallets}
    renderLoader={() => <p>Loading...</p>}
    localStorageKey={LOCAL_STORAGE_KEY}
    defaultChainId={ChainInfoID.Juno1}
    getSigningCosmWasmClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        '0.0025' + chainInfo.feeCurrencies[0].coinMinimalDenom
      ),
    })}
    getSigningStargateClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        '0.0025' + chainInfo.feeCurrencies[0].coinMinimalDenom
      ),
    })}
    // Choose a different RPC node for the desired chain.
    // chainInfoOverrides={[
    //   {
    //     ...ChainInfoMap[ChainInfoID.Juno1],
    //     rpc: "https://another.rpc.com",
    //   }
    // ]}
  >
    <Component {...pageProps} />
  </WalletManagerProvider>
)

export default MyApp
