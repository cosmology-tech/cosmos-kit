import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp
