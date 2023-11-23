/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import "../style/global.css";
import "@interchain-ui/react/styles";

import { Chain } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as coin98Wallets } from "@cosmos-kit/coin98";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as exodusWallets } from "@cosmos-kit/exodus";
import { wallets as finWallets } from "@cosmos-kit/fin";
import { wallets as frontierWallets } from "@cosmos-kit/frontier";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as snapWallet } from "@cosmos-kit/leap-metamask-cosmos-snap";
import { wallets as ledgerWallets } from "@cosmos-kit/ledger";
import { wallets as ninjiWallets } from "@cosmos-kit/ninji";
import { wallets as omniWallets } from "@cosmos-kit/omni";
// Show how to custom modal views
import { ChainProvider, defaultModalViews } from "@cosmos-kit/react";
// import { ChainProvider } from "@cosmos-kit/react";
import { wallets as shellWallets } from "@cosmos-kit/shell";
import { wallets as stationWallets } from "@cosmos-kit/station";
import { wallets as trustWallets } from "@cosmos-kit/trust";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
// import { makeWeb3AuthWallets } from "@cosmos-kit/web3auth";
import { wallets as xdefiWallets } from "@cosmos-kit/xdefi";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";

// import { CustomConnectedView } from "../components/custom-connected";
import { RootLayout } from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  // const web3AuthWallets = useMemo(
  //   () =>
  //     makeWeb3AuthWallets({
  //       loginMethods: [
  //         {
  //           provider: "google",
  //           name: "Google",
  //           logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
  //         },
  //       ],
  //       client: {
  //         clientId: "localhostid",
  //         web3AuthNetwork: "testnet",
  //       },
  //       promptSign: async (...args) =>
  //         // eslint-disable-next-line no-alert
  //         confirm("Sign transaction? \n" + JSON.stringify(args, null, 2)),
  //     }),
  //   []
  // );

  return (
    <RootLayout>
      <ChainProvider
        chains={[...chains.filter((c) => c.chain_name == "cosmoshub")]}
        assetLists={[...assets]}
        wallets={[
          ...keplrWallets,
          // ...leapWallets,
          // ...ninjiWallets,
          // ...snapWallet,
          // ...ledgerWallets,
          // ...web3AuthWallets,
          // ...trustWallets,
          // ...stationWallets,
          // ...cosmostationWallets,
          // ...omniWallets,
          // ...exodusWallets,
          // ...shellWallets,
          // ...vectisWallets,
          // ...xdefiWallets,
          // ...frontierWallets,
          // ...coin98Wallets,
          // ...finWallets,
        ]}
        throwErrors={false}
        subscribeConnectEvents={false}
        defaultNameService={"stargaze"}
        walletConnectOptions={{
          signClient: {
            projectId: "a8510432ebb71e6948cfd6cde54b70f7",
            relayUrl: "wss://relay.walletconnect.org",
            metadata: {
              name: "CosmosKit Example",
              description: "CosmosKit test dapp",
              url: "https://test.cosmoskit.com/",
              icons: [
                "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
              ],
            },
          },
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
        logLevel={"DEBUG"}
        endpointOptions={{
          isLazy: true,
          endpoints: {
            cosmoshub: {
              rpc: [
                {
                  url: "https://rpc.cosmos.directory/cosmoshub2",
                  headers: {},
                },
              ],
            },
            // terra2: {
            //   rpc: ["https://terra-rpc.lavenderfive.com/"],
            //   rest: ["https://phoenix-lcd.terra.dev/"],
            // },
            // terra2testnet: {
            //   rpc: ["https://terra-testnet-rpc.polkachu.com/"],
            //   rest: ["https://pisco-lcd.terra.dev/"],
            // },
          },
        }}
        disableIframe={false}
        // // ==== Custom base modal customization
        // // modalTheme={{
        // //   modalContentClassName: "my-custom-modal-content",
        // }}
        // // ==== Custom components
        // // modalViews={{
        // //   ...defaultModalViews,
        // //   Connected: CustomConnectedView,
        // // }}
      >
        <Component {...pageProps} />
      </ChainProvider>
    </RootLayout>
  );
}

export default MyApp;
