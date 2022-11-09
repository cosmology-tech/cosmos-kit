import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import 'nextra-theme-docs/style.css';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[]}
      >
        <Component {...pageProps} />
      </WalletProvider>
  );
}

export default MyApp;
