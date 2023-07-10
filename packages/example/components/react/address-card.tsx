import { WalletStatus } from "@cosmos-kit/core";
import { Badge } from "components/badge";
import React, { ReactNode, useEffect, useState } from "react";

import { CopyAddressType } from "../types";

export function stringTruncateFromdiv(str: string, maxLength: number) {
  const midChar = "…"; // character to insert into the center of the result

  if (str.length <= maxLength) return str;

  // length of beginning part
  const left = Math.ceil(maxLength / 2);

  // start index of ending part
  const right = str.length - Math.floor(maxLength / 2) + 1;

  return str.substring(0, left) + midChar + str.substring(right);
}

export const ConnectedShowAddress = ({
  address,
  walletIcon,
  size = "md",
  maxDisplayLength,
}: CopyAddressType) => {
  const [displayAddress, setDisplayAddress] = useState(
    "address not available yet"
  );

  const defaultMaxLength = {
    lg: 14,
    md: 16,
    sm: 18,
  };

  useEffect(() => {
    if (!address) {
      setDisplayAddress("address not available yet");
    } else if (maxDisplayLength) {
      setDisplayAddress(stringTruncateFromdiv(address, maxDisplayLength));
    } else {
      setDisplayAddress(
        stringTruncateFromdiv(
          address,
          defaultMaxLength[size as keyof typeof defaultMaxLength]
        )
      );
    }
  }, [address]);

  if (!address) return null;

  return (
    <Badge variant="outline">
      {address && walletIcon && (
        <div>
          <img alt={displayAddress} src={walletIcon} width={50} />
        </div>
      )}
      <p className="leading-7 [&:not(:first-child)]:mt-6">{displayAddress}</p>
    </Badge>
  );
};

export const CopyAddressBtn = ({
  walletStatus,
  connected,
}: {
  walletStatus: WalletStatus;
  connected: ReactNode;
}) => {
  switch (walletStatus) {
    case "Connected":
      return <>{connected}</>;
    default:
      return (
        <div>
          <ConnectedShowAddress
            isLoading={walletStatus === "Connecting" ? true : false}
            isRound={true}
            size={"sm"}
          />
        </div>
      );
  }
};
