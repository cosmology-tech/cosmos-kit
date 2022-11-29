import { Text, Center, Flex, GridItem, Icon, Box } from "@chakra-ui/react";
import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { MouseEventHandler } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import {
  ChainCard,
  Connected,
  ConnectedShowAddress,
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

export const SingleWalletSection = ({
  chainName,
}: {
  chainName: ChainName;
}) => {
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    chain: { pretty_name },
    logoUrl,
    wallet,
  } = useChain(chainName);

  // const pretty_name = "test";

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
          wordOfWarning={`${pretty_name}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${pretty_name}: ${message}`}
        />
      }
    />
  );

  const chainInfo = (
    <ChainCard prettyName={pretty_name || chainName} icon={logoUrl} />
  );
  const userInfo = (
    <Text fontSize="l" fontWeight="semibold" paddingEnd={"18px"} color={"blue"}>
      {username
        ? `${wallet?.prettyName} / ${username}`
        : "<wallet> / <username>"}
    </Text>
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
    <Flex color="white">
      <Center w="200px">{chainInfo}</Center>
      <Center w="250px">{userInfo}</Center>
      <Center w="250px" marginEnd={"80px"}>
        {addressBtn}
      </Center>
      <Center w="150px">{connectWalletButton}</Center>
      <Center>
        {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
      </Center>
    </Flex>
  );
};
