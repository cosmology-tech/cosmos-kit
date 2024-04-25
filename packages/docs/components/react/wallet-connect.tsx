import * as React from "react";
import {
  Button,
  Box,
  Text,
  Stack,
  useColorModeValue,
} from "@interchain-ui/react";
import { IoWallet } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import { WalletStatus } from "cosmos-kit";

interface IConnectWalletButton {
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClickConnectBtn?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  onClickConnectBtn,
}: IConnectWalletButton) => {
  return (
    <Button
      fluidWidth
      size="md"
      isLoading={isLoading}
      disabled={isDisabled}
      onClick={onClickConnectBtn}
      attributes={{
        position: "relative",
      }}
    >
      <div
        style={{
          borderRadius: "8px",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          zIndex: "0",
          margin: "-1px",
          position: "absolute",
          backgroundImage: `linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)`,
        }}
      />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="$4"
        as="span"
        borderRadius="8px"
        style={{
          zIndex: "1",
        }}
      >
        <Box as="span">
          <IoWallet />
        </Box>

        <Box as="span">{buttonText ? buttonText : "Connect Wallet"}</Box>
      </Box>
    </Button>
  );
};

export const Disconnected = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
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
  onClick: React.MouseEventHandler<HTMLButtonElement>;
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
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const bg = useColorModeValue("$orange200", "$orange300");

  return (
    <Stack direction="vertical">
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />

      {wordOfWarning && (
        <Stack
          direction="horizontal"
          space="$1"
          attributes={{
            borderRadius: "$md",
            backgroundColor: bg,
            color: "$text",
            padding: "$2",
          }}
        >
          <Box display="inline-block">
            <FiAlertTriangle />
          </Box>

          <Text fontSize="$sm">
            <Text as="span" fontWeight="$semibold">
              Warning:&ensp;
            </Text>

            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const Error = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const bg = useColorModeValue("$orange200", "$orange300");

  return (
    <Stack direction="vertical">
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />

      {wordOfWarning && (
        <Stack
          direction="horizontal"
          space="$1"
          attributes={{
            borderRadius: "$md",
            backgroundColor: bg,
            color: "$text",
            padding: "$2",
          }}
        >
          <Box display="inline-block">
            <FiAlertTriangle />
          </Box>

          <Text fontSize="$sm">
            <Text fontWeight="$semibold" as="span">
              Warning:&ensp;
            </Text>

            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const NotExist = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton
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
  disconnect: React.ReactNode;
  connecting: React.ReactNode;
  connected: React.ReactNode;
  rejected: React.ReactNode;
  error: React.ReactNode;
  notExist: React.ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
