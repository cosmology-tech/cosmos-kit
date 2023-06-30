import { useChain } from "@cosmos-kit/react";

export default () => {
  const { username, connect, disconnect, wallet, status } =
    useChain("cosmoshub");

  const getConnectbutton = () => {
    if (status === "Connecting") {
      return <button>{`Connecting ${wallet?.prettyName}`}</button>;
    }
    if (status === "Connected") {
      return (
        <div>
          <span>{wallet?.prettyName}</span>
          <span>{username}</span>
          <button
            onClick={async () => {
              await disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      );
    }

    return <button onClick={() => connect()}>Connect Wallet</button>;
  };

  return (
    <div>
      <div>
        <h5>Cosmos Hub</h5>
        {getConnectbutton()}
      </div>
    </div>
  );
};
