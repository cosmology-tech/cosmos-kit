import { ChainProvider } from '../src'
import { assets } from 'chain-registry'
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import React from 'react'
import { Chain } from '@chain-registry/types';
import { ChainName } from '@cosmos-kit/core';
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react';

const AllTheProviders = ({ children }) => {
  return (
    <ChainProvider
      chains={['juno', 'stargaze']}
      assetLists={assets}
      wallets={[keplrWallets[0], leapWallets[0]]}
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

const customRenderHook = <P, R>(hook: (props: P) => R, options?: RenderHookOptions<P>) =>
  renderHook(hook, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRenderHook as renderHook }
