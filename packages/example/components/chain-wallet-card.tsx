import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { Button } from "components/button";
import { Badge } from "components/badge";
import { useIsClient } from "../hooks";
import { ConnectedShowAddress } from "./react";

export const ChainWalletCard = ({
  chainName,
  type = "address-on-page",
}: {
  chainName: ChainName;
  type: "address-in-modal" | "address-on-page";
}) => {
  const { chain, status, address } = useChain(chainName);
  const isClient = useIsClient();

  if (!isClient) return null;

  if (type === "address-in-modal") {
    return (
      <div className="flex space-x-10">
        <Badge variant="outline">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {chain.pretty_name}
          </p>
        </Badge>
        <Button>View address</Button>
      </div>
    );
  }

  if (type === "address-on-page") {
    <div className="flex space-x-10">
      <Badge variant="outline">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {chain.pretty_name}
        </p>
      </Badge>
      <ConnectedShowAddress
        address={address}
        isLoading={status === "Connecting"}
        isRound={true}
        size={"sm"}
      />
    </div>;
  }

  return null;
};
