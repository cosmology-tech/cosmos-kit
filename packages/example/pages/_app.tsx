import { Chain } from "@chain-registry/types";
import { ChakraProvider } from "@chakra-ui/react";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
import { defaultTheme, WalletProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[
          ...keplrWallet,
          ...cosmostationWallets,
          ...leapwallets,
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
        // walletModal={MyModal}
        // walletModal={'simple_v1'}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default MyApp;
