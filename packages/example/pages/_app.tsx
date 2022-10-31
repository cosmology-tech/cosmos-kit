import type { AppProps } from 'next/app';
import { CosmosProvider } from '@cosmos-kit/react';
import { ChakraProvider } from '@chakra-ui/react';
import { assets, chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';
// import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from '@cosmos-kit/keplr';
// import { wallets as leapwallets } from "@cosmos-kit/leap";
import { GasPrice } from '@cosmjs/stargate';
import { Decimal } from "@cosmjs/math";

import { defaultTheme } from '../config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <CosmosProvider
        chains={chains}
        assetLists={assets}
        // wallets={[...keplrWallet, ...leapwallets, ...cosmostationWallets]}
        wallets={[...keplrWallet]}
        signerOptions={{
          stargate: (chain: Chain) => {
            switch (chain.chain_name) {
              case 'osmosis':
                return {
                  gasPrice: new GasPrice(Decimal.zero(1), 'uosmo')
                }           
              default:
                return void 0;
            }
          },
          cosmwasm: (chain: Chain) => undefined,
        }}
        endpointOptions={{
          somechainname: {
            rpc: ["http://test.com"],
          },
        }}
      >
        <Component {...pageProps} />
      </CosmosProvider>
    </ChakraProvider>
  );
}

export default MyApp;
