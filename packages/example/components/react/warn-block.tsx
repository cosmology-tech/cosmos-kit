import { WalletStatus } from "@cosmos-kit/core";
import React, { ReactNode } from "react";

export const WarnBlock = ({
  wordOfWarning,
  icon,
}: {
  wordOfWarning?: string;
  icon?: ReactNode;
}) => {
  return (
    <div>
      <div>
        <div>{icon}</div>
        <span>{wordOfWarning}</span>
      </div>
    </div>
  );
};

export const RejectedWarn = ({
  wordOfWarning,
  icon,
}: {
  wordOfWarning?: string;
  icon?: ReactNode;
}) => {
  return <WarnBlock wordOfWarning={wordOfWarning} icon={icon} />;
};

export const ConnectStatusWarn = ({
  walletStatus,
  rejected,
  error,
}: {
  walletStatus: WalletStatus;
  rejected: ReactNode;
  error: ReactNode;
}) => {
  switch (walletStatus) {
    case "Rejected":
      return <>{rejected}</>;
    case "Error":
      return <>{error}</>;
    default:
      return <></>;
  }
};
