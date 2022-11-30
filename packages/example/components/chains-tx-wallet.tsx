import {
  Box,
  Center,
  Grid,
  GridItem,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { MouseEventHandler } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import {
  Astronaut,
  ChainCard,
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
      connected={
        <Box width={"full"} px={8}>
          <ConnectedShowAddress
            address={address}
            isLoading={false}
            isRound={true}
            size={"sm"}
          />
        </Box>
      }
    />
  );

  return (
    <Center py={16}>
      <Grid
        w="full"
        maxW="sm"
        templateColumns="1fr"
        rowGap={4}
        alignItems="center"
        justifyContent="center"
      >
        <GridItem marginBottom={"20px"}>
          <ChainCard prettyName={pretty_name || chainName} icon={logoUrl} />
        </GridItem>
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
            <GridItem>{connectWalletWarn}</GridItem>
          </Stack>
        </GridItem>
      </Grid>
    </Center>
  );
};
