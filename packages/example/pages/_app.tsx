import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';
import { wallets } from '@cosmos-kit/config';
import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        wallets={wallets}
        signerOptions={{
          stargate: (chain: Chain) => undefined,
          cosmwasm: (chain: Chain) => undefined,
        }}
        >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp
