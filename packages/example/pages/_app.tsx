/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import "../style/global.css";
import "@cosmology-ui/react/styles";

import { Chain } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as exodusWallets } from "@cosmos-kit/exodus-extension";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { ChainProvider } from "@cosmos-kit/react";
import { makeWeb3AuthWallets } from "@cosmos-kit/web3auth";
import { assets, chains } from "chain-registry";
// import { wallets as coin98Wallets } from "@cosmos-kit/coin98";
// import { wallets as shellWallets } from "@cosmos-kit/shell";
// import { wallets as stationWallets } from "@cosmos-kit/station";
// import { wallets as ExtensionWallets } from "@cosmos-kit/station-extension";
// import { wallets as trustWallets } from "@cosmos-kit/trust";
// import { wallets as vectisWallets } from "@cosmos-kit/vectis";
// import { wallets as web3authWallets } from "@cosmos-kit/web3auth";
// import { wallets as xdefiWallets } from "@cosmos-kit/xdefi-extension";
// import { wallets as ledgerWallets } from "@cosmos-kit/ledger";
import { RootLayout } from "components/layout";
import type { AppProps } from "next/app";
import { useMemo } from "react";

import { terra2testnet, terra2testnetAssets } from "../config/terra2testnet";

function MyApp({ Component, pageProps }: AppProps) {
  const web3AuthWallets = useMemo(
    () =>
      makeWeb3AuthWallets({
        loginMethods: [
          {
            provider: "google",
            name: "Google",
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
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
    <RootLayout>
      <ChainProvider
        chains={[...chains, terra2testnet]}
        assetLists={[...assets, terra2testnetAssets]}
        wallets={[
          ...keplrWallets,
          // ...web3authWallets,
          // ...cosmostationWallets,
          // ...exodusWallets,
          // ...shellWallets,
          ...cosmostationWallets,
          ...exodusWallets,
          // ...leapWallets,
          // ...vectisWallets,
          // ...xdefiWallets,
          // ...omniWallets,
          // ...trustWallets,
          // ...frontierWallets,
          // ...stationWallets,
          // ...ExtensionWallets,
          // ...coin98Wallets,
          ...web3AuthWallets
        ]}
        throwErrors={false}
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
        wrappedWithChakra={true} // required if `ChainProvider` is imported from `@cosmos-kit/react`
        endpointOptions={{
          isLazy: true,
          endpoints: {
            cosmoshub: {
              isLazy: false,
              rpc: [
                {
                  isLazy: true,
                  url: "https://rpc.cosmos.directory/cosmoshub",
                  headers: {},
                },
              ],
            },
            terra2: {
              rpc: ["https://terra-rpc.lavenderfive.com/"],
              rest: ["https://phoenix-lcd.terra.dev/"],
            },
            terra2testnet: {
              rpc: ["https://terra-testnet-rpc.polkachu.com/"],
              rest: ["https://pisco-lcd.terra.dev/"],
            },
          },
        }}
      >
        <Component {...pageProps} />
      </ChainProvider>
    </RootLayout>
  );
}

export default MyApp;
