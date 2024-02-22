import Image from "next/image";
import { Box, ClipboardCopyText, Stack } from "@interchain-ui/react";
import { WalletStatus } from "cosmos-kit";
import React, { ReactNode, useEffect, useState } from "react";

const SIZES = {
  lg: {
    height: 32,
    walletImageSize: 144,
  },
  md: {
    height: 24,
    walletImageSize: 96,
  },
  sm: {
    height: 20,
    walletImageSize: 64,
  },
};

type CopyAddressType = {
  address?: string;
  walletIcon?: string;
  isLoading?: boolean;
  maxDisplayLength?: number;
  size?: keyof typeof SIZES;
};

export const ConnectedShowAddress = ({
  address = "",
  walletIcon,
  isLoading,
  size = "md",
  maxDisplayLength,
}: CopyAddressType) => {
  const [displayAddress, setDisplayAddress] = useState<string>("");
  const defaultMaxLength = {
    lg: 14,
    md: 16,
    sm: 18,
  };

  useEffect(() => {
    if (!address) setDisplayAddress("address not identified yet");
    if (address && maxDisplayLength)
      setDisplayAddress(stringTruncateFromCenter(address, maxDisplayLength));
    if (address && !maxDisplayLength)
      setDisplayAddress(
        stringTruncateFromCenter(
          address,
          defaultMaxLength[size as keyof typeof defaultMaxLength]
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const walletImgDimension = `${
    SIZES[size as keyof typeof SIZES].walletImageSize
  }px`;

  const chainIcon =
    address && walletIcon ? (
      <Box
        borderRadius="$full"
        width="100%"
        height="100%"
        minWidth={walletImgDimension}
        minHeight={walletImgDimension}
        maxWidth={walletImgDimension}
        maxHeight={walletImgDimension}
        marginRight="$4"
        opacity={0.85}
      >
        <Image src={walletIcon} alt={displayAddress} />
      </Box>
    ) : null;

  return (
    <Stack direction="vertical">
      {chainIcon}
      <ClipboardCopyText
        text={address}
        truncate="middle"
        midTruncateLimit="md"
      />
    </Stack>
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
    case WalletStatus.Connected:
      return <>{connected}</>;
    default:
      return <></>;
  }
};

function stringTruncateFromCenter(str: string, maxLength: number) {
  const midChar = "…"; // character to insert into the center of the result

  if (str.length <= maxLength) return str;

  // length of beginning part
  const left = Math.ceil(maxLength / 2);

  // start index of ending part
  const right = str.length - Math.floor(maxLength / 2) + 1;

  return str.substring(0, left) + midChar + str.substring(right);
}
