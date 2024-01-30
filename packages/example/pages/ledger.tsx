import { useEffect, useState } from "react";
import { useChain, useWallet, useWalletClient } from "@cosmos-kit/react";
import { Badge } from "components/badge";
import { Button } from "components/button";
import { PaperPlaneIcon, ResetIcon } from "@radix-ui/react-icons";

const DEFAULT_TO_ADDRESS = "cosmos1xane5m7g6a845pfwldh6kparm357wu3grrt7hc";

export type SignResult = {
  signature: Buffer | null;
  return_code: string | number;
};

export type Account = {
  "@type": string;
  address: string;
  pub_key: { "@type": string; key: string };
  account_number: string;
  sequence: string;
};

export function getAccountURL(address: string) {
  return `https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts/${address}`;
}

export default function () {
  const [toAddress, setToAddress] = useState<string>(DEFAULT_TO_ADDRESS);
  const [account, setAccount] = useState<Account>({} as Account);
  const [isReviewing, setIsReviewing] = useState(false);
  const [signResult, setSignResult] = useState<SignResult>({} as SignResult);
  const { username, address, connect, disconnect, wallet, openView } =
    useChain("cosmoshub");
  const { status: globalStatus } = useWallet();
  const { client } = useWalletClient("ledger-web-usb-hid");

  useEffect(() => {
    if (address) {
      fetch(getAccountURL(address))
        .then((res) => res.json())
        .then((data) => setAccount(data?.account));
    }
  }, [address]);

  const message = {
    account_number: account.account_number ?? "",
    chain_id: "cosmoshub-4",
    fee: { amount: [{ amount: "500", denom: "uatom" }], gas: "200000" },
    memo: "Send tokens from Ledger Nano S",
    msgs: [
      {
        type: "cosmos-sdk/MsgSend",
        value: {
          amount: { amount: "1000", denom: "uatom" },
          from_address: address ?? "",
          to_address: toAddress ?? "",
        },
      },
    ],
    sequence: account.sequence ?? "",
  };

  async function sign() {
    setSignResult({} as SignResult);
    setIsReviewing(true);
    try {
      const result = await client?.sign?.(message);
      if (result) setSignResult(result);
    } catch (error: any) {
      alert(error?.message);
    } finally {
      setIsReviewing(false);
    }
  }

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
              setAccount({} as Account);
              setSignResult({} as SignResult);
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Ledger</h1>
      <p className="font-semibold my-5">
        Connect your Ledger device with an USB cable, unlock it and open the
        Cosmos App.
      </p>
      <div className="space-y-5">
        <div className="flex justify-start space-x-5">{getGlobalbutton()}</div>
        <div className="space-y-4">
          <p className="font-mono">
            <span className="text-sm font-semibold text-gray-600">
              From Address:{" "}
            </span>{" "}
            {address}
          </p>
          <p className="font-mono flex items-center">
            <span className="text-sm font-semibold text-gray-600">
              To Address:{" "}
            </span>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder={DEFAULT_TO_ADDRESS}
              className="ml-4 flex-1 border border-gray-300 rounded-md px-2 py-1"
            />
          </p>
          <p className="font-mono">
            Message:
            {globalStatus === "Connected" ? (
              <Button onClick={sign} className="ml-2" disabled={isReviewing}>
                Sign
              </Button>
            ) : null}
            {isReviewing ? (
              <span className="ml-2 text-sm font-semibold text-blue-600">
                Please review message in Ledger
              </span>
            ) : null}
          </p>
          <pre className="text-sm">
            <code>{JSON.stringify(message, null, 2)}</code>
          </pre>
          <p className="font-mono">Result:</p>
          <pre className="text-sm">
            <code>{JSON.stringify(signResult, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
