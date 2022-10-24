import { assets, chains } from 'chain-registry';

import type { AppProps } from 'next/app';
import { Chain } from '@chain-registry/types';
import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from '@cosmos-kit/react'
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { defaultTheme } from '../config';
import { wallets as keplrWallet } from '@cosmos-kit/keplr';
import { wallets as leapwallets } from "@cosmos-kit/leap";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallet, ...leapwallets, ...cosmostationWallets]}
        signerOptions={{
          stargate: (chain: Chain) => undefined,
          cosmwasm: (chain: Chain) => undefined,
        }}
        endpointOptions={{
          somechainname: {
            rpc: ["http://test.com"],
          },
        }}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default MyApp;
