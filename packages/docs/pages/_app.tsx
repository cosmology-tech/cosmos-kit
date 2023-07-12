import "@interchain-ui/react/styles";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainProvider } from "@cosmos-kit/react";
import { ChakraProvider } from "@chakra-ui/react";
import { assets, chains } from "chain-registry";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as exodusWallets } from "@cosmos-kit/exodus-extension";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { makeWeb3AuthWallets } from "@cosmos-kit/web3auth";
import { wallets as coin98Wallets } from "@cosmos-kit/coin98";
import { wallets as shellWallets } from "@cosmos-kit/shell";
import { wallets as stationWallets } from "@cosmos-kit/station";
import { wallets as omniWallets } from "@cosmos-kit/omni";
import { wallets as trustWallets } from "@cosmos-kit/trust";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
import { wallets as frontierWallets } from "@cosmos-kit/frontier";
import { wallets as xdefiWallets } from "@cosmos-kit/xdefi-extension";
import { wallets as ledgerWallets } from "@cosmos-kit/ledger";
import { wallets as finWallets } from "@cosmos-kit/fin";
import "nextra-theme-docs/style.css";
import React, { useMemo } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const web3AuthWallets = useMemo(
    () =>
      makeWeb3AuthWallets({
        loginMethods: [
          {
            provider: "google",
            name: "Google",
            logo:
              "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          },
        ],
        client: {
          clientId: "localhostid",
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: "other",
          },
        },
        promptSign: async (...args) =>
          // eslint-disable-next-line no-alert
          confirm("Sign transaction? \n" + JSON.stringify(args, null, 2)),
      }),
    []
  );

  return (
    <ChakraProvider>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[
          ...keplrWallets,
          ...ledgerWallets,
          ...web3AuthWallets,
          ...trustWallets,
          ...stationWallets,
          ...cosmostationWallets,
          ...omniWallets,
          ...exodusWallets,
          ...shellWallets,
          ...leapWallets,
          ...vectisWallets,
          ...xdefiWallets,
          ...frontierWallets,
          ...coin98Wallets,
          ...finWallets,
        ]}
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
