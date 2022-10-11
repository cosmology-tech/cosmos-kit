import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';

import { chains, assets } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { wallets } from '@cosmos-kit/keplr';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={wallets}
        signerOptions={{
          stargate: (chain: Chain) => undefined,
          cosmwasm: (chain: Chain) => undefined,
        }}
        endpointOptions={{
          somechainname: {
            rpc: ['http://test.com']
          }
        }}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp
