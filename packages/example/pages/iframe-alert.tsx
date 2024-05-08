import { useChain, useIframe } from "@cosmos-kit/react-lite";
import { useState } from "react";

export default () => {
  const { iframeRef } = useIframe({
    walletClientOverrides: {
      signAmino: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("amino: " + JSON.stringify(params, null, 2));
      },
      signDirect: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("direct: " + JSON.stringify(params, null, 2));
      },
    },
    signerOverrides: {
      signAmino: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("signer/amino: " + JSON.stringify(params, null, 2));
      },
      signDirect: (...params: unknown[]) => {
        // eslint-disable-next-line no-alert
        alert("signer/direct: " + JSON.stringify(params, null, 2));
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

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [url, setUrl] = useState("");

  const go = () => {
    if (iframe) {
      iframe.src = url;
    }
  };

  return (
    <>
      {getConnectButton()}

      <div className="flex flex-col gap-2 mt-8">
        <div className="flex flex-row justify-between items-center gap-2">
          <input
            className="grow"
            style={{
              padding: 4,
              borderRadius: 4,
            }}
            type="text"
            autoComplete="off"
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                go();
              }
            }}
            placeholder="URL"
            value={url}
          />

          <button
            onClick={go}
            style={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: "#333333",
            }}
          >
            Go
          </button>
        </div>

        <iframe
          ref={(ref) => {
            setIframe(ref);
            iframeRef(ref);
          }}
          style={{
            width: "100%",
            height: "75vh",
            borderRadius: 4,
          }}
        ></iframe>
      </div>
    </>
  );
};
