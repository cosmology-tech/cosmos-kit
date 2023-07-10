import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import React, { MouseEventHandler } from "react";

import {
  Astronaut,
  ChainDiv,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  Error,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from "./react";

export function ChainsTXWalletSection({ chainName }: { chainName: ChainName }) {
  const walletManager = useChain(chainName);
  const {
    chain: { pretty_name },
    wallet,
    connect,
    openView,
    status,
    username,
    address,
    message,
    logoUrl,
  } = walletManager;

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletbutton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={"My Wallet"} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={status}
      rejected={
        <RejectedWarn wordOfWarning={`${wallet?.prettyName}: ${message}`} />
      }
      error={
        <RejectedWarn wordOfWarning={`${wallet?.prettyName}: ${message}`} />
      }
    />
  );

  const userInfo = username && (
    <ConnectedUserInfo username={username} icon={<Astronaut />} />
  );

  const addressBtn = (
    <CopyAddressBtn
      walletStatus={status}
      connected={
        <div>
          <ConnectedShowAddress
            address={address}
            isLoading={false}
            isRound={true}
            size={"sm"}
          />
        </div>
      }
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div>{connectWalletbutton}</div>
        <ChainDiv prettyName={pretty_name || chainName} icon={logoUrl} />
        {addressBtn}
      </div>

      {userInfo}

      <div>{connectWalletWarn}</div>
    </div>
  );
}
