import { useChainWallet } from "@cosmos-kit/react";
import { useEffect } from "react";

const Test = () => {
  const { signAndBroadcast, connect, address } = useChainWallet(
    "osmosis",
    "keplr-extension"
  );

  useEffect(() => {
    connect();
  }, []);

  const onClick = async () => {
    const voteMessages = [];

    voteMessages.push({
      typeUrl: "/cosmos.gov.v1beta1.MsgVote",
      value: {
        voter: address,
        proposalId: "369",
        option: 2,
      },
    });

    const fee = {
      amount: [
        {
          denom: "uosmo",
          amount: "0",
        },
      ],
      gas: "200000",
    };

    const res = await signAndBroadcast(voteMessages, fee);

    if (res) {
      alert("Voted successfully!");
    }
  };

  return (
    <div>
      <button onClick={onClick}>Vote</button>
    </div>
  );
};

export default Test;
