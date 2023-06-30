import { useChain, useManager } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { ConnectedShowAddress } from "../components";

const chainName = "cosmoshub";

export default () => {
  const { chain, status, address, connect } = useChain(chainName);
  const { on, off } = useManager();
  const [list, setList] = useState<string[]>([]);

  const handler = () => {
    list.push("trigger event refresh_connection");
    setList(list);
  };

  useEffect(() => {
    on("refresh_connection", handler);
    return () => {
      off("refresh_connection", handler);
    };
  }, []);

  return (
    <div>
      <div>
        <h5>{chain.pretty_name}</h5>
        {status === "Connecting" ? (
          <button>Connecting</button>
        ) : (
          <button onClick={() => connect()}>Open Modal</button>
        )}

        <div>
          <ConnectedShowAddress
            address={address}
            isLoading={status === "Connecting"}
            isRound={true}
            size={"sm"}
          />
        </div>
      </div>
      <div>
        <div>
          <div>
            {list.map((value, index) => (
              <div key={index}>{value}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
