import {
  Box,
  Button,
  Icon,
  Image,
  Text,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import React, { ReactNode, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

import { CopyAddressType } from "../types";
import { handleChangeColorModeValue } from "./handleChangeColor";

const SIZES = {
  lg: {
    height: 12,
    walletImageSize: 7,
    icon: 5,
    fontSize: "md",
  },
  md: {
    height: 10,
    walletImageSize: 6,
    icon: 4,
    fontSize: "sm",
  },
  sm: {
    height: 7,
    walletImageSize: 5,
    icon: 3.5,
    fontSize: "sm",
  },
};

export function stringTruncateFromCenter(str: string, maxLength: number) {
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
  isLoading,
  isRound,
  size = "md",
  maxDisplayLength,
}: CopyAddressType) => {
  const { hasCopied, onCopy } = useClipboard(address ? address : "");
  const [displayAddress, setDisplayAddress] = useState("");
  const { colorMode } = useColorMode();
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
  }, [address]);

  return (
    <Button
      title={address}
      variant="unstyled"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={isRound ? "full" : "lg"}
      border="1px solid"
      borderColor={handleChangeColorModeValue(
        colorMode,
        "gray.200",
        "whiteAlpha.300"
      )}
      w="full"
      h={SIZES[size as keyof typeof SIZES].height}
      minH="fit-content"
      pl={2}
      pr={2}
      color={handleChangeColorModeValue(
        colorMode,
        "gray.700",
        "whiteAlpha.600"
      )}
      transition="all .3s ease-in-out"
      isDisabled={!address && true}
      isLoading={isLoading}
      _hover={{
        bg: "rgba(142, 142, 142, 0.05)",
      }}
      _focus={{
        outline: "none",
      }}
      _disabled={{
        opacity: 0.6,
        cursor: "not-allowed",
        borderColor: "rgba(142, 142, 142, 0.1)",
        _hover: {
          bg: "transparent",
        },
        _active: {
          outline: "none",
        },
        _focus: {
          outline: "none",
        },
      }}
      onClick={onCopy}
    >
      {address && walletIcon && (
        <Box
          borderRadius="full"
          w="full"
          h="full"
          minW={SIZES[size as keyof typeof SIZES].walletImageSize}
          minH={SIZES[size as keyof typeof SIZES].walletImageSize}
          maxW={SIZES[size as keyof typeof SIZES].walletImageSize}
          maxH={SIZES[size as keyof typeof SIZES].walletImageSize}
          mr={2}
          opacity={0.85}
        >
          <Image alt={displayAddress} src={walletIcon} />
        </Box>
      )}
      <Text
        fontSize={SIZES[size as keyof typeof SIZES].fontSize}
        fontWeight="normal"
        letterSpacing="0.4px"
        opacity={0.75}
      >
        {displayAddress}
      </Text>
      {address && (
        <Icon
          as={hasCopied ? FaCheckCircle : FiCopy}
          w={SIZES[size as keyof typeof SIZES].icon}
          h={SIZES[size as keyof typeof SIZES].icon}
          ml={2}
          opacity={0.9}
          color={
            hasCopied
              ? "green.400"
              : handleChangeColorModeValue(
                  colorMode,
                  "gray.500",
                  "whiteAlpha.400"
                )
          }
        />
      )}
    </Button>
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
        <Box width={"full"} px={8}>
          <ConnectedShowAddress
            isLoading={walletStatus === "Connecting" ? true : false}
            isRound={true}
            size={"sm"}
          />
        </Box>
      );
  }
};
