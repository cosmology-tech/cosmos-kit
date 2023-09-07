import { useChain, useWallet } from "@cosmos-kit/react";
import { PaperPlaneIcon, ResetIcon } from "@radix-ui/react-icons";
import { Badge } from "components/badge";
import { Button } from "components/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/card";
import { ChainWalletCard } from "components/chain-wallet-card";
import { useEffect } from "react";

import { useIsClient } from "../hooks";

// const chainNames_1 = ["cosmoshub"];
// const chainNames_2: string[] = ["cosmoshub"];

// const chainNames_1 = ["osmosis", "cosmoshub"];
// const chainNames_2 = ["stargaze", "chihuahua"];

const chainNames_1 = ["cosmoshub"];
// const chainNames_1 = ["migaloo"];
// const chainNames_2: string[] = ["osmosis"];

// const chainNames_1 = ["coreum"];
const chainNames_2: string[] = [];

export default function IndexPage() {
  const { username, connect, disconnect, wallet, openView } = useChain(
    chainNames_1[0]
  );
  const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)
  const isClient = useIsClient();

  useEffect(() => {
    const fn = async () => {
      await mainWallet?.connect();
    };
    fn();
  }, []);

  if (!isClient) return null;

  const getGlobalbutton = () => {
    if (globalStatus === "Connecting") {
      return (
        <Button onClick={() => connect()}>
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
          {`Connecting ${wallet?.prettyName}`}
        </Button>
      );
    }
    if (globalStatus === "Connected") {
      return (
        <>
          <Button variant="default" size="sm" onClick={() => openView()}>
            <div className="flex justify-center items-center space-x-2">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 leading-4 mb-2" />
              <span>Connected to: {wallet?.prettyName}</span>
            </div>
          </Button>

          <Badge className="flex" variant="outline">
            Account name: {username}
          </Badge>

          <Button
            variant="destructive"
            onClick={async () => {
              await disconnect();
              // setGlobalStatus(WalletStatus.Disconnected);
            }}
          >
            <ResetIcon className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </>
      );
    }

    return <Button onClick={() => connect()}>Connect Wallet</Button>;
  };

  return (
    <Card className="min-w-[350px] max-w-[800px] mt-20 mx-auto p-10">
      <CardHeader>
        <CardTitle>
          <p className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            ChainProvider Test
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-start space-x-5">{getGlobalbutton()}</div>

        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Address div in Modal
        </h2>
        {chainNames_1.map((chainName) => (
          <ChainWalletCard
            key={chainName}
            type="address-in-modal"
            chainName={chainName}
          />
        ))}
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Address div on Page
        </h2>
        {chainNames_2.map((chainName) => (
          <ChainWalletCard
            key={chainName}
            type="address-on-page"
            chainName={chainName}
          />
        ))}
      </CardContent>
    </Card>
  );
}
