import { WalletManager, Logger } from "@cosmos-kit/core";
import { useMemo, useState } from "react";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as stationWallets } from "@cosmos-kit/station";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as oWallets } from "@cosmos-kit/owallet";
import { assets } from "chain-registry";
import { Button } from "components/button";
export default () => {
  const walletManager = useMemo(() => {
    return new WalletManager(
      ["cosmoshub", "juno", "stargaze"],
      [keplrWallets[0], leapWallets[0], oWallets[0], stationWallets[0]],
      new Logger("NONE"),
      false,
      undefined,
      undefined,
      assets
    );
  }, []);

  const [_, forceUpdate] = useState(0);

  const mainWallets = walletManager.mainWallets;

  return (
    <div>
      Main Wallets
      <table className="text-xs table-auto">
        <thead>
          <tr>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Wallet
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Connect
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Disconnect
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Chain
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Address
            </td>
          </tr>
        </thead>
        <tbody>
          {mainWallets.map((mainWallet) => {
            const chainWallets = mainWallet.getChainWalletList(false);
            return chainWallets.map((w, index) => {
              return (
                <tr>
                  {index === 0 && (
                    <>
                      <td
                        className="border p-2 break-words w-16 overflow-wrap text-wrap"
                        rowSpan={chainWallets.length}
                      >
                        {w.walletName}
                      </td>
                      <td
                        className="border p-2 w-60"
                        rowSpan={chainWallets.length}
                      >
                        <Button
                          onClick={async () => {
                            await mainWallet.connectAll(false);
                            forceUpdate((i) => i + 1);
                          }}
                        >
                          MainWallets Connect All
                        </Button>
                      </td>
                      <td
                        className="border p-2 w-64"
                        rowSpan={chainWallets.length}
                      >
                        <Button
                          onClick={async () => {
                            await mainWallet.disconnectAll(false);
                            forceUpdate((i) => i + 1);
                          }}
                        >
                          MainWallets Disconnect All
                        </Button>
                      </td>
                    </>
                  )}
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    {w.chainName}
                  </td>
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    {w.address}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};
