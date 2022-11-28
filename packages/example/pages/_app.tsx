import { Chain } from "@chain-registry/types";
import { ChakraProvider } from "@chakra-ui/react";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as trustWallets } from "@cosmos-kit/trust";
import {
  defaultTheme,
  WalletProvider,
  WalletProviderV2,
} from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";
import "./test-style.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[
          ...keplrWallet,
          ...trustWallets,
          ...cosmostationWallets,
          ...leapWallets,
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
        <WalletProviderV2
          chains={chains}
          assetLists={assets}
          wallets={[
            ...keplrWallet,
            ...trustWallets,
            ...cosmostationWallets,
            ...leapWallets,
          ]}
        >
          <Component {...pageProps} />
        </WalletProviderV2>
      </WalletProvider>
    </ChakraProvider>
  );
}

export default MyApp;
