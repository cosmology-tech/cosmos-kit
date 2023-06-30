import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { MouseEventHandler } from "react";

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
} from ".";

export const ChainsTXWalletSection = ({
  chainName,
}: {
  chainName: ChainName;
}) => {
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
    <div>
      <div>
        <div>
          <ChainDiv prettyName={pretty_name || chainName} icon={logoUrl} />
        </div>
        <div>
          <div>
            {userInfo}
            {addressBtn}
            <div>{connectWalletbutton}</div>
            <div>{connectWalletWarn}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
