import React, { ReactNode } from "react";
import { WalletStatus } from "@cosmos-kit/core";
import { Callout, CalloutProps } from "@interchain-ui/react";

export const RejectedWarn = ({
  wordOfWarning,
  intent,
}: {
  wordOfWarning?: string;
  icon?: ReactNode;
  intent?: CalloutProps["intent"];
}) => {
  return (
    <Callout
      iconName="errorWarningFill"
      intent={intent ?? "warning"}
      title={intent === "error" ? "Error" : "Warn"}
    >
      {wordOfWarning}
    </Callout>
  );
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
