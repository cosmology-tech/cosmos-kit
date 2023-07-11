import { WalletStatus } from "@cosmos-kit/core";
import React, { MouseEventHandler, ReactNode } from "react";

import { Button } from "components/button";
import { ConnectWalletType } from "../types";

export const ConnectWalletbutton = ({
  buttonText,
  isLoading,
  isDisabled,
  icon,
  onClickConnectBtn,
}: ConnectWalletType) => {
  return (
    <>
      {isLoading ? (
        <Button disabled>Connecting...</Button>
      ) : (
        <Button disabled={isDisabled} onClick={onClickConnectBtn}>
          {buttonText ? buttonText : "Connect Wallet"}
        </Button>
      )}
    </>
  );
};

export const Disconnected = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletbutton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Connected = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletbutton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Connecting = () => {
  return <ConnectWalletbutton isLoading={true} />;
};

export const Rejected = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div>
      <ConnectWalletbutton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && (
        <div>
          <span>
            <span>Warning:&ensp;</span>
            {wordOfWarning}
          </span>
        </div>
      )}
    </div>
  );
};

export const Error = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div>
      <ConnectWalletbutton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && (
        <div>
          <span>
            <span>Warning:&ensp;</span>
            {wordOfWarning}
          </span>
        </div>
      )}
    </div>
  );
};

export const NotExist = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletbutton
      buttonText={buttonText}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  error,
  notExist,
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  error: ReactNode;
  notExist: ReactNode;
}) => {
  switch (walletStatus) {
    case "Disconnected":
      return <>{disconnect}</>;
    case "Connecting":
      return <>{connecting}</>;
    case "Connected":
      return <>{connected}</>;
    case "Rejected":
      return <>{rejected}</>;
    case "Error":
      return <>{error}</>;
    case "NotExist":
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
