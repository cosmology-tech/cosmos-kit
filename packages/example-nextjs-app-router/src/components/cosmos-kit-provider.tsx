"use client";

import "@interchain-ui/react/styles";
import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets } from "@cosmos-kit/keplr";

export function CosmosKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChainProvider
      chains={chains}
      assetLists={assets}
      wallets={wallets}
      logLevel={"DEBUG"}
    >
      {children}
    </ChainProvider>
  );
}
