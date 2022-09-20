import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';
import { WalletManager, ChainInfo } from '@cosmos-kit/core';
import { allWallets } from '@cosmos-kit/registry';
import { chains as rawChains } from 'chain-registry';
import { convert } from '../utils';


const chains: ChainInfo[] = rawChains
  .filter((chain) => chain.network_type !== 'testnet')
  .map((chain) => convert(chain));


function MyApp({ Component, pageProps }: AppProps) {
  const walletManager = new WalletManager(
    chains,
    allWallets
  )
  // walletManager.useWallets('keplr-extension');
  // walletManager.useChains();

  walletManager.setAutos({
    closeViewWhenWalletIsConnected: false,
    closeViewWhenWalletIsDisconnected: true,
    closeViewWhenWalletIsRejected: false,
  })

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        // walletModal={MyWalletModal}  // import { WalletModalProps } from '@cosmos-kit/core';
        walletManager={walletManager}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp
