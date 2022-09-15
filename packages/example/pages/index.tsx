import { useWallet } from "@cosmos-kit/react";
import { chainInfos } from "../config";
import { Box, Center, Grid, GridItem, Icon, Stack, useColorModeValue, Text, Link } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Astronaut, ChainOption, ChooseChain, Connected, ConnectedShowAddress, ConnectedUserInfo, Connecting, ConnectStatusWarn, CopyAddressBtn, Disconnected, handleSelectChainDropdown, NotExist, Rejected, RejectedWarn, WalletConnectComponent } from "../components";

const Home = () => {
  const walletManager = useWallet();
  const { connect, disconnect, openModal,
    walletStatus, username, address, message,
    currentChainName: chainName } = walletManager;

  // Events
  const onClickOpenModal: MouseEventHandler = (e) => {
    e.preventDefault();
    openModal();
  };

  const onClickConnect: MouseEventHandler = (e) => {
    e.preventDefault();
    connect();
  };

  const onClickDisconnect: MouseEventHandler = (e) => {
    e.preventDefault();
    if (address) {
      openModal();
    } else {
      disconnect();
    }
  };

  const onChainChange: handleSelectChainDropdown = (
    selectedValue: ChainOption | null
  ) => {
    walletManager.setCurrentChain(selectedValue?.chainName);
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickOpenModal} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={
          address
            ? `${address.slice(0, 7)}....${address.slice(-4)}`
            : "Disconnect"
        } onClick={onClickOpenModal} />
      }
      rejected={
        <Rejected
          buttonText="Reconnect"
          onClick={onClickOpenModal}
        />
      }
      notExist={<NotExist buttonText="Install Wallet" onClick={onClickOpenModal} />}
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${message}`}
        />
      }
    />
  );
  const chooseChain = (
    <ChooseChain
      chainName={chainName}
      chainInfos={chainInfos}
      onChange={onChainChange}
    />
  );

  const userInfo = <ConnectedUserInfo username={username} icon={<Astronaut />} />;
  const addressBtn = chainName && (
    <CopyAddressBtn
      walletStatus={walletStatus}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
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
        <GridItem>{chooseChain}</GridItem>
        <GridItem>{connectWalletWarn}</GridItem>
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
      </Grid>
    </Center>
  );
}

export default Home;
