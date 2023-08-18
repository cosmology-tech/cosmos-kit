import { useChain, useIframe } from "@cosmos-kit/react-lite";

export default () => {
  const iframeRef = useIframe({
    walletClientOverrides: {
      signAmino: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("amino: " + JSON.stringify(params, null, 2));
        return true;
      },
      signDirect: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("direct: " + JSON.stringify(params, null, 2));
        return true;
      },
    },
    aminoSignerOverrides: {
      signAmino: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("signer/amino: " + JSON.stringify(params, null, 2));
        return true;
      },
    },
    directSignerOverrides: {
      signDirect: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("signer/direct: " + JSON.stringify(params, null, 2));
        return true;
      },
    },
  });

  const { username, connect, disconnect, wallet, status } =
    useChain("cosmoshub");

  const getConnectButton = () => {
    if (status === "Connecting") {
      return <button>{`Connecting ${wallet?.prettyName}`}</button>;
    }
    if (status === "Connected") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
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
    <>
      {getConnectButton()}

      <iframe
        ref={iframeRef}
        src="http://localhost:3009/tx"
        style={{
          width: "100%",
          height: "1000px",
        }}
      ></iframe>
    </>
  );
};
