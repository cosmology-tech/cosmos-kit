import { WalletStatus } from "@cosmos-kit/core";
import { useChain, useManager } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";

import { ConnectedShowAddress } from "../components";

const chainNames_1 = ["osmosis"];
const chainNames_2 = ["osmosis", "chihuahua"];

export default () => {
  const usernames: (string | undefined)[] = [];
  const walletNames: (string | undefined)[] = [];
  const statusList: WalletStatus[] = [];
  const connectList: (() => void)[] = [];
  const disconnectList: (() => void)[] = [];
  const { addChains, getWalletRepo } = useManager();

  const addressInModal = chainNames_1.map((chainName) => {
    const { chain, openView, username, wallet, status, connect, disconnect } =
      useChain(chainName);
    usernames.push(username);
    walletNames.push(wallet?.prettyName);
    statusList.push(status);
    connectList.push(connect);
    disconnectList.push(disconnect);

    return (
      <div>
        <h5>{chain.pretty_name}</h5>
        {status === "Connecting" ? (
          <button>Connecting</button>
        ) : (
          <button onClick={openView}>View Address</button>
        )}
      </div>
    );
  });

  const addressOnPage = chainNames_2.map((chainName) => {
    const { chain, username, address, connect, status, disconnect, wallet } =
      useChain(chainName);
    usernames.push(username);
    walletNames.push(wallet?.prettyName);
    statusList.push(status);
    connectList.push(connect);
    disconnectList.push(disconnect);

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
  });

  const getGlobalbutton = () => {
    if (statusList.find((s) => s === "Connecting")) {
      return <button>Connecting</button>;
    }
    if (statusList.find((s) => s === "Connected")) {
      return (
        <div>
          <button>{walletNames[0]}</button>
          <button>{usernames[0]}</button>
          <button onClick={() => disconnectList[0]()}>Disconnect</button>
        </div>
      );
    }

    return <button onClick={() => connectList[0]()}>Connect Wallet</button>;
  };

  return (
    <div>
      <div>
        <h5>ChainProvider Test</h5>
        {getGlobalbutton()}
        <button
          onClick={() => {
            addChains(
              chains.filter((chain) => chain.chain_name === "cosmoshub"),
              assets.filter((assets) => assets.chain_name === "cosmoshub")
            );
            const walletRepo = getWalletRepo("cosmoshub");
            walletRepo.isActive = true;
            walletRepo.connect();
          }}
        >
          Add Cosmos Hub
        </button>
      </div>
      <div>
        <div>
          <h5>Address div in Modal</h5>
        </div>
        <div>
          <div>{addressInModal}</div>
        </div>
      </div>
      <div>
        <div>
          <h5>Address div on Page</h5>
        </div>
        <div>
          <div>{addressOnPage}</div>
        </div>
      </div>
    </div>
  );
};
