import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { defaultTheme, WalletProvider } from '@cosmos-kit/react';
import { ChakraProvider } from '@chakra-ui/react';
import { assets, chains } from 'chain-registry';
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from '@cosmos-kit/keplr';
import { wallets as leapwallets } from "@cosmos-kit/leap";
import 'nextra-theme-docs/style.css';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallet, ...cosmostationWallets, ...leapwallets]}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default MyApp;
