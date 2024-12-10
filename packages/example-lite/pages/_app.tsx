import "bootstrap/dist/css/bootstrap.min.css";
import "@interchain-ui/react/styles";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as ctrlWallets } from "@cosmos-kit/ctrl";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";
import React from "react";
import { CustomModal } from "../components/custom-modal";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChainProvider
      chains={[...chains.filter((c) => c.chain_name == "cosmoshub")]}
      assetLists={[...assets.filter((a) => a.chain_name === "cosmoshub")]}
      wallets={[...keplrWallets, ...ctrlWallets]}
      logLevel={"DEBUG"}
      walletModal={CustomModal}
    >
      <Component {...pageProps} />
    </ChainProvider>
  );
}

export default MyApp;
