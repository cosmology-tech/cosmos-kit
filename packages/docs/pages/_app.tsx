import "../styles/globals.css";
import type { AppProps } from "next/app";
import { defaultTheme, ChainProvider } from "@cosmos-kit/react";
import { ChakraProvider } from "@chakra-ui/react";
import { assets, chains } from "chain-registry";
import { wallets as cosmostation } from "@cosmos-kit/cosmostation";
import { wallets as keplr } from "@cosmos-kit/keplr";
import { wallets as leap } from "@cosmos-kit/leap";
import { wallets as frontier } from "@cosmos-kit/frontier";
import { wallets as vectis } from "@cosmos-kit/vectis";
import { wallets as xdefi } from "@cosmos-kit/xdefi-extension";
import { wallets as omni } from "@cosmos-kit/omni";
import { wallets as trust } from "@cosmos-kit/trust";
import { wallets as station } from "@cosmos-kit/station";
import "nextra-theme-docs/style.css";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[
          ...keplr,
          ...cosmostation,
          ...leap,
          ...vectis,
          // ...xdefi,
          ...omni,
          ...trust,
          ...station,
          ...frontier,
        ]}
        wrappedWithChakra={true}
        walletConnectOptions={{
          signClient: {
            projectId: "61e6745dc9a852e0ed9ba60d28212357",
            relayUrl: "wss://relay.walletconnect.org",
            metadata: {
              name: "CosmosKit Example",
              description: "CosmosKit Docs",
              url: "https://docs.cosmoskit.com/",
              icons: [
                "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
              ],
            },
          },
        }}
      >
        <Component {...pageProps} />
      </ChainProvider>
    </ChakraProvider>
  );
}

export default MyApp;
