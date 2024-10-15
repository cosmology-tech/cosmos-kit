import { WalletManager, Logger } from "@cosmos-kit/core";
import { useMemo, useState } from "react";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as stationWallets } from "@cosmos-kit/station";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as oWallets } from "@cosmos-kit/owallet";
import { assets } from "chain-registry";
import { Button } from "components/button";
import { SigningStargateClient } from "@cosmjs/stargate";

export default () => {
  const walletManager = useMemo(() => {
    return new WalletManager(
      ["cosmoshub", "juno", "stargaze"],
      [keplrWallets[0], oWallets[0], leapWallets[0], stationWallets[0]],
      new Logger("NONE"),
      false,
      undefined,
      undefined,
      assets
    );
  }, []);

  const wallet = walletManager
    .getWalletRepo("juno")
    .getWallet("keplr-extension");

  const [accounts, setAccounts] = useState(undefined);
  const [signingStargateClient, setSigningStargateClient] = useState<
    SigningStargateClient | undefined
  >(undefined);

  const [_, forceUpdate] = useState(0);

  const connect = async () => {
    try {
      await wallet?.connect();
    } catch (error) {
      console.log(error);
    }
    forceUpdate((i) => i + 1);
  };

  const disconnect = async () => {
    try {
      await wallet?.disconnect();
    } catch (error) {
      console.log(error);
    }
    forceUpdate((i) => i + 1);
  };

  const initOfflineSigner = async () => {
    try {
      await wallet?.initOfflineSigner();
    } catch (error) {
      console.error(error);
    }
    forceUpdate((i) => i + 1);
  };

  const getAccounts = async () => {
    try {
      const accounts = await wallet?.offlineSigner?.getAccounts();
      setAccounts(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  const getSigningStargateClient = async () => {
    try {
      const client = await wallet?.getSigningStargateClient();
      setSigningStargateClient(client);
    } catch (error) {
      console.error(error);
    }
  };

  const getFastEndpoints = async () => {
    try {
      const fastEndpoints = await wallet?.getRestEndpoint(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      KeplrWallet - JUNO
      <div className="space-x-1 space-y-1">
        <Button onClick={connect}>Connect</Button>
        <Button onClick={disconnect}>Disconnect</Button>
        <Button disabled={!wallet?.client} onClick={initOfflineSigner}>
          Init Offline Signer
        </Button>
        <Button disabled={!wallet?.offlineSigner} onClick={getAccounts}>
          Get Account
        </Button>
        {/* <Button
          disabled={!wallet?.offlineSigner}
          onClick={getSigningStargateClient}
        >
          Get Signing Stargate Client
        </Button>
        <Button onClick={getFastEndpoints}>Get Fast Endpoints</Button> */}
      </div>
      <p>status:{wallet?.state}</p>
      <p>address:{wallet?.address}</p>
      <p>walletState:{wallet?.walletStatus}</p>
      <div>
        offline signer accounts: <pre>{JSON.stringify(accounts, null, 2)}</pre>
      </div>
      {/* <div>
        SigningStargateClient:
        {signingStargateClient?.broadcastTimeoutMs}
      </div> */}
    </div>
  );
};
