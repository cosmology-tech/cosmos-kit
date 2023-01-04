import "../style/test-style.css";

import { Chain } from "@chain-registry/types";
import { ChakraProvider } from "@chakra-ui/react";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as wcv2Wallets } from "@cosmos-kit/wcv2";
import { ChainProvider, defaultTheme, WalletProvider } from "@cosmos-kit/react";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[
          ...wcv2Wallets,
          ...keplrWallets,
          ...cosmostationWallets,
          ...leapWallets,
          ...vectisWallets,
        ]}
        signerOptions={{
          signingStargate: (chain: Chain) => {
            switch (chain.chain_name) {
              case "osmosis":
                return {
                  gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
                };
              default:
                return void 0;
            }
          },
          signingCosmwasm: (chain: Chain) => undefined,
        }}
        endpointOptions={{
          somechainname: {
            rpc: ["http://test.com"],
          },
        }}
      >
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wallets={[
            ...wcv2Wallets,
            ...keplrWallets,
            ...cosmostationWallets,
            ...leapWallets,
            ...vectisWallets,
          ]}
          wcSignClientOptions={{
            projectId: "a8510432ebb71e6948cfd6cde54b70f7",
            relayUrl: "wss://relay.walletconnect.org",
          }}
          signerOptions={{
            signingStargate: (chain: Chain) => {
              switch (chain.chain_name) {
                case "osmosis":
                  return {
                    gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
                  };
                default:
                  return void 0;
              }
            },
          }}
        >
          <Component {...pageProps} />
        </ChainProvider>
      </WalletProvider>
    </ChakraProvider>
  );
}

export default MyApp;
