import "../styles/globals.css";
import type { AppProps } from "next/app";
import { defaultTheme, ChainProvider } from "@cosmos-kit/react";
import { ChakraProvider } from "@chakra-ui/react";
import { assets, chains } from "chain-registry";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr-extension";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { wallets as vectisWallets } from "@cosmos-kit/vectis";
import { wallets as xdefiWallets } from "@cosmos-kit/xdefi-extension";
import { wallets as omniWallets } from "@cosmos-kit/omni";
import { wallets as trustWallets } from "@cosmos-kit/trust";
import "nextra-theme-docs/style.css";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[
          ...keplrWallet,
          ...cosmostationWallets,
          ...leapwallets,
          ...vectisWallets,
          ...xdefiWallets,
          ...omniWallets,
          ...trustWallets,
        ]}
      >
        <Component {...pageProps} />
      </ChainProvider>
    </ChakraProvider>
  );
}

export default MyApp;
