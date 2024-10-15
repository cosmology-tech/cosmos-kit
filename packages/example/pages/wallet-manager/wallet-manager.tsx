import { WalletManager, Logger } from "@cosmos-kit/core";
import { useMemo, useState } from "react";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as stationWallets } from "@cosmos-kit/station";
import { wallets as coin98Wallets } from "@cosmos-kit/coin98";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as oWallets } from "@cosmos-kit/owallet";
import { assets } from "chain-registry";
import { Button } from "components/button";
import { AccountData } from "@cosmjs/proto-signing";

export default () => {
  const walletManager = useMemo(() => {
    return new WalletManager(
      ["cosmoshub", "juno", "stargaze"],
      [
        keplrWallets[0],
        oWallets[0],
        leapWallets[0],
        stationWallets[0],
        coin98Wallets[0],
      ],
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
      <pre>
        {JSON.stringify(
          {
            activeRepos: walletManager.activeRepos,
          },
          null,
          2
        )}
      </pre>
      <div>Main Wallets</div>
      <table>
        <tbody>
          {walletManager.mainWallets.map((mw) => {
            return mw.getChainWalletList(false).map((cw) => {
              cw.callbacks = {
                beforeConnect: () => console.log("beforeConnect"),
                beforeDisconnect: () => console.log("beforeDisconnect"),
                afterConnect: () => forceUpdate((i) => i + 1),
                afterDisconnect: () => forceUpdate((i) => i + 1),
              };

              const [account, setAccount] = useState<AccountData[] | undefined>(
                undefined
              );

              const getAddress = async () => {
                await cw.initOfflineSigner();
                const account = await cw.offlineSigner?.getAccounts();
                setAccount(account);
              };

              return (
                <tr>
                  <td className="border-gray-500 p-1 border-2">
                    {mw.walletName}
                  </td>
                  <td className="border-gray-500 p-1 border-2">
                    {cw.chainName}
                  </td>
                  <td className="border-gray-500 p-1 border-2 space-x-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        cw.connect(true);
                        forceUpdate((i) => i + 1);
                      }}
                    >
                      connect
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        cw.disconnect(true);
                        forceUpdate((i) => i + 1);
                      }}
                    >
                      disconnect
                    </Button>
                    <Button size="sm" onClick={getAddress}>
                      get offline signer
                    </Button>
                  </td>
                  <td className="border-gray-500 p-1 border-2">{cw.state}</td>
                  <td className="border-gray-500 p-1 border-2">{cw.message}</td>
                  <td className="border-gray-500 p-1 border-2">
                    {account?.[0]?.address}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
      <div>Wallet Repo</div>
      <table>
        <tbody>
          {walletManager.walletRepos.map((wr) => {
            return (
              <>
                <tr key={wr.chainName}>
                  <td className="border-gray-500 p-2 border-2">
                    current: {wr.current?.walletName}
                  </td>
                  <td>{"client"}</td>
                </tr>
                {wr.wallets.map((w) => {
                  const [account, setAccount] = useState<
                    AccountData[] | undefined
                  >(undefined);

                  const getAddress = async () => {
                    await w.initOfflineSigner();
                    const account = await w.offlineSigner?.getAccounts();
                    if (account) {
                      setAccount(account);
                    }
                  };

                  return (
                    <tr key={`${wr.chainName}-${w.walletName}`}>
                      <td className="border-gray-500 p-1 border-2">
                        {w.chainName}
                      </td>
                      <td className="border-gray-500 p-1 border-2">
                        {w.walletName}
                      </td>
                      <td className="border-gray-500 p-1 border-2 space-x-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            w.connect();
                            forceUpdate((i) => i + 1);
                          }}
                        >
                          connect
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            w.disconnect();
                            forceUpdate((i) => i + 1);
                          }}
                        >
                          disconnect
                        </Button>
                        <Button size="sm" onClick={getAddress}>
                          get offline signer
                        </Button>
                      </td>
                      <td className="border-gray-500 p-1 border-2">
                        {w.state}
                      </td>
                      <td className="border-gray-500 p-1 border-2">
                        {w.message}
                      </td>
                      <td className="border-gray-500 p-1 border-2">
                        {account?.[0]?.address}
                      </td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
