import React, { MouseEventHandler, ReactNode } from "react";
import { Button, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { WalletStatus } from "./types";
import { IoWallet } from "react-icons/io5";
import { ConnectWalletType } from "./types";
import { FiAlertTriangle } from "react-icons/fi";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  icon,
  onClickConnectBtn,
}: ConnectWalletType) => {
  return (
    <Button
      w="full"
      minW="fit-content"
      size="lg"
      isLoading={isLoading}
      isDisabled={isDisabled}
      bgImage="linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)"
      color="white"
      opacity={1}
      transition="all .5s ease-in-out"
      _hover={{
        bgImage:
          "linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)",
        opacity: 0.75,
      }}
      _active={{
        bgImage:
          "linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)",
        opacity: 0.9,
      }}
      onClick={onClickConnectBtn}
    >
      <Icon as={icon ? icon : IoWallet} mr={2} />
      {buttonText ? buttonText : "Connect Wallet"}
    </Button>
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
    <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />
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
    <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
};

export const Rejected = ({
  buttonText,
  wordOfWarning,
}: {
  buttonText: string;
  wordOfWarning?: string;
}) => {
  return (
    <Stack>
      <ConnectWalletButton buttonText={buttonText} isDisabled={true} />
      {wordOfWarning && (
        <Stack
          isInline={true}
          borderRadius="md"
          bg={useColorModeValue("orange.200", "orange.300")}
          color="blackAlpha.900"
          p={4}
          spacing={1}
        >
          <Icon as={FiAlertTriangle} mt={1} />
          <Text>
            <Text fontWeight="semibold" as="span">
              Warning:&ensp;
            </Text>
            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const NotExist = ({ buttonText }: { buttonText: string }) => {
  return <ConnectWalletButton buttonText={buttonText} isDisabled={true} />;
};

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  notExist,
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  notExist: ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.Unloaded:
      return <>{disconnect}</>;
    case WalletStatus.Loading:
      return <>{connecting}</>;
    case WalletStatus.Loaded:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
