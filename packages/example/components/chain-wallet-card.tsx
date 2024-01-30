import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { Badge } from "components/badge";
import { Button } from "components/button";

import { useIsClient } from "../hooks";
import { ConnectedShowAddress } from "./react";

export const ChainWalletCard = ({
  chainName,
  type = "address-on-page",
}: {
  chainName: ChainName;
  type: "address-in-modal" | "address-on-page";
}) => {
  const { chain, status, address, openView, chainWallet, walletRepo } =
    useChain(chainName);
  const isClient = useIsClient();

  if (!isClient) return null;

  if (type === "address-in-modal") {
    return (
      <div className="flex space-x-4">
        <Badge variant="default">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {chain?.pretty_name}
          </p>
        </Badge>
        <Button disabled={status === "Connecting"} onClick={() => openView()}>
          {status === "Connecting" ? "Connecting..." : "View address"}
        </Button>
      </div>
    );
  }

  if (type === "address-on-page") {
    return (
      <div className="flex space-x-4">
        <Badge variant="default">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {chain?.pretty_name}
          </p>
        </Badge>
        {address && (
          <ConnectedShowAddress
            address={address}
            isLoading={status === "Connecting"}
            isRound={true}
            size={"sm"}
          />
        )}
      </div>
    );
  }

  return null;
};
