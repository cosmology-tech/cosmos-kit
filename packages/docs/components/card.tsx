import { useChain } from "@cosmos-kit/react";
import {
  Box,
  GridItem,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { MouseEventHandler, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Astronaut,
  Error,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from ".";

export const WalletCardSection = ({ chainName }: { chainName: string }) => {
  const { connect, openView, status, username, address, message, wallet } =
    useChain(chainName);

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
  const connectWalletButton = (
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
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
    />
  );

  const userInfo = username && (
    <ConnectedUserInfo username={username} icon={<Astronaut />} />
  );
  const addressBtn = (
    <CopyAddressBtn
      walletStatus={status}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  return (
    <>
      {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
      <GridItem px={6}>
        <Stack
          justifyContent="center"
          alignItems="center"
          borderRadius="lg"
          bg={useColorModeValue("white", "blackAlpha.400")}
          boxShadow={useColorModeValue(
            "0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3",
            "0 0 2px #363636, 0 0 8px -2px #4f4f4f"
          )}
          spacing={4}
          px={4}
          py={{ base: 6, md: 12 }}
        >
          {userInfo}
          {addressBtn}
          <Box w="full" maxW={{ base: 52, md: 64 }}>
            {connectWalletButton}
          </Box>
        </Stack>
      </GridItem>
    </>
  );
};
