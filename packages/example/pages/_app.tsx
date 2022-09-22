import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';
import { walletRecords } from '@cosmos-kit/config';
import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        wallets={walletRecords}
        signerOptions={{
          stargate: (chain: Chain): SigningStargateClientOptions | undefined => undefined,
          cosmwasm: (chain: Chain): SigningCosmWasmClientOptions | undefined => undefined,
        }}
        >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp
