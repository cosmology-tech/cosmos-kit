import { ChainProvider } from '../src'
import { assets, chains } from 'chain-registry'
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import { wallets as stationWallets } from "@cosmos-kit/station-extension";
import React from 'react'
import { Chain } from '@chain-registry/types';
import { ChainName } from '@cosmos-kit/core';
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";

export const customWrapper = ({ children }) => {
  return (
    <ChainProvider
      chains={chains.filter(c => ['juno', 'stargaze', 'osmosis', 'cosmoshub'].includes(c.chain_name))}
      assetLists={assets}
      wallets={[...leapWallets, ...stationWallets, ...keplrWallets]}
      walletModal={() => <div>Wallet Modal</div>}
      subscribeConnectEvents={true}
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
        signingStargate: (chain: Chain | ChainName) => {
          const chainName =
            typeof chain === "string" ? chain : chain.chain_name;
          switch (chainName) {
            case "osmosis":
              return {
                // @ts-ignore
                gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
              };
          }
        }
      }}>
      {children}
    </ChainProvider>
  )
}

export const CustomWrapper = customWrapper
