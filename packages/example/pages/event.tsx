import { useChain, useManager } from "@cosmos-kit/react";
import { useEffect } from "react";

const chainName = "cosmoshub";

export default () => {
  const { chain, status, username, address, connect } = useChain(chainName);
  const { on, off } = useManager();

  const handler = () => {
    console.log("trigger event refresh_connection");
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
        {status === "Connecting" ? (
          <button>Connecting</button>
        ) : (
          <button onClick={() => connect()}>Open Modal</button>
        )}
        <h5>{`Chain: ${chain.pretty_name}`}</h5>
        <div>{`Username: ${username}`}</div>
        <div>{`Address: ${address}`}</div>
      </div>
    </div>
  );
};
