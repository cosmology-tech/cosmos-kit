import { Chain } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import type { AppProps } from "next/app";
import { DefaultModal } from "@cosmos-kit/react/index";
import { useEffect, useState } from "react";
import "./App.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);
  const [colorMode, setColorMode] = useState<string | null>(null);

  function handleOpen() {
    setOpen(!open);
  }

  function handleColorMode() {
    setColorMode(colorMode === "light" ? "dark" : "light");
    colorMode === "light"
      ? window.localStorage.setItem("chakra-ui-color-mode", "dark")
      : window.localStorage.setItem("chakra-ui-color-mode", "light");
  }

  // set system color to default color mode
  useEffect(() => {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setColorMode(systemDark ? "dark" : "light");
    window.localStorage.setItem(
      "chakra-ui-color-mode",
      systemDark ? "dark" : "light"
    );
  }, []);

  return (
    <div>
      <button
        style={{ background: "#f3c674", padding: 4, margin: 16 }}
        onClick={handleOpen}
      >
        open modal
      </button>
      <button
        style={{ background: "#f6c3fb", padding: 4, margin: 16 }}
        onClick={handleColorMode}
      >
        color mode
      </button>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallet, ...cosmostationWallets, ...leapwallets]}
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
        <DefaultModal isOpen={open} setOpen={handleOpen} />
      </WalletProvider>
    </div>
  );
}

export default MyApp;
