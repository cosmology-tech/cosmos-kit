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
      [keplrWallets[0], oWallets[0], leapWallets[0], stationWallets[0]],
      new Logger("NONE"),
      false,
      undefined,
      undefined,
      assets
    );
  }, []);

  const [_, forceUpdate] = useState(0);

  return (
    <div>
      Wallet Repos
      <table className="text-xs table-auto">
        <thead>
          <tr>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Chain
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Current Chain Wallet
            </td>
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
              State
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Address
            </td>
            <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
              Download Link
            </td>
          </tr>
        </thead>
        <tbody>
          {walletManager.walletRepos.map((wr) => {
            return wr.wallets.map((w, index) => {
              return (
                <tr>
                  {index === 0 && (
                    <td
                      rowSpan={wr.wallets.length}
                      className="border p-2 break-words w-16 overflow-wrap text-wrap"
                    >
                      {w.chainName}
                    </td>
                  )}
                  {index === 0 && (
                    <td
                      rowSpan={wr.wallets.length}
                      className="border p-2 break-words w-16 overflow-wrap text-wrap"
                    >
                      {wr?.current?.walletName}-{wr.current?.chainName}
                    </td>
                  )}
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    {w.walletName}
                  </td>
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    <Button
                      onClick={async () => {
                        await w.connect(true);
                        forceUpdate((i) => i + 1);
                      }}
                    >
                      connect
                    </Button>
                  </td>
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    <Button
                      onClick={async () => {
                        await w.disconnect(true);
                        forceUpdate((i) => i + 1);
                      }}
                    >
                      disconnect
                    </Button>
                  </td>
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    {w.walletStatus}
                  </td>
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    address:{w.address}
                  </td>
                  <td className="border p-2 break-words w-16 overflow-wrap text-wrap">
                    {w.downloadInfo?.link}
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
