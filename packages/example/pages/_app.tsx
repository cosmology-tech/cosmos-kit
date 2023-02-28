import "../style/test-style.css";

import { Chain } from "@chain-registry/types";
import { ChakraProvider } from "@chakra-ui/react";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as exodusWallets } from "@cosmos-kit/exodus-extension";
import { wallets as xdefiWallets } from "@cosmos-kit/xdefi-extension";
import { wallets as omniWallets } from "@cosmos-kit/omni";
import { wallets as trustWallets } from "@cosmos-kit/trust";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
import { wallets as frontierWallets } from "@cosmos-kit/frontier";
import { wallets as stationWallets } from "@cosmos-kit/station";
import { wallets as ExtensionWallets } from "@cosmos-kit/station-extension";
import { wallets as coin98Wallets } from "@cosmos-kit/coin98";
import { wallets as web3authWallets } from "@cosmos-kit/web3auth";
import { ChainProvider, defaultTheme } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@cosmology-ui/react";
import { terra2testnet, terra2testnetAssets } from "../config/terra2testnet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ChakraProvider theme={defaultTheme}>
        <ChainProvider
          chains={[...chains, terra2testnet]}
          assetLists={[...assets, terra2testnetAssets]}
          wallets={[
            ...keplrWallets,
            // ...web3authWallets,
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
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default MyApp;
