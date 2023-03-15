import "../style/test-style.css";

import { Chain } from "@chain-registry/types";
import { ChakraProvider } from "@chakra-ui/react";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as xdefiWallets } from "@cosmos-kit/xdefi-extension";
import { wallets as omniWallets } from "@cosmos-kit/omni";
import { wallets as trustWallets } from "@cosmos-kit/trust";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
import { wallets as frontierWallets } from "@cosmos-kit/frontier-extension";
// import { ChainProvider } from "@cosmos-kit/react-lite";
import { ChainProvider, defaultTheme, DefaultModal } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";
import { WalletViewProps } from "@cosmos-kit/core";
import { ThemeProvider } from "@cosmology-ui/react";

// const ConnectedView = ({ onClose, onReturn, wallet }: WalletViewProps) => {
//   const {
//     walletInfo: { prettyName },
//     username,
//     address,
//   } = wallet;

//   return <div>{`${prettyName}/${username}/${address}`}</div>;
// };

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ChakraProvider theme={defaultTheme}>
        <ChainProvider
          // used when testing add-chain
          // chains={chains.filter((chain) => chain.chain_name !== "cosmoshub")}
          // assetLists={assets.filter(
          //   (assets) => assets.chain_name !== "cosmoshub"
          // )}
          chains={chains}
          assetLists={assets}
          wallets={[
            // ...keplrWallets,
            // ...cosmostationWallets,
            // ...leapWallets,
            // ...vectisWallets,
            ...xdefiWallets,
            // ...omniWallets,
            // ...trustWallets,
            // ...frontierWallets,
          ]}
          walletModal={DefaultModal}
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
          // modalViews={{
          //   Connected: ConnectedView,
          // }}
        >
          <Component {...pageProps} />
        </ChainProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default MyApp;
