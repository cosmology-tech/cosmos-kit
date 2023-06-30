import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { ConnectedShowAddress } from "./react";

export const ChainWalletdiv = ({
  chainName,
  type = "address-on-page",
}: {
  chainName: ChainName;
  type: string;
}) => {
  const { chain, status, address } = useChain(chainName);

  switch (type) {
    case "address-in-modal":
      return (
        <div>
          <h5>{chain.pretty_name}</h5>
          <button>View Address</button>
        </div>
      );
    case "address-on-page":
      return (
        <div>
          <h5>{chain.pretty_name}</h5>
          <div>
            <ConnectedShowAddress
              address={address}
              isLoading={status === "Connecting"}
              isRound={true}
              size={"sm"}
            />
          </div>
        </div>
      );
    default:
      throw new Error("No such chain card type: " + type);
  }
};
