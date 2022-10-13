import type { AppProps } from 'next/app';
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';

import { chains, assets } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { wallets as keplrWallet } from '@cosmos-kit/keplr';
import { wallets as leapwallets } from "@cosmos-kit/leap";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallet, ...leapwallets]}
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
