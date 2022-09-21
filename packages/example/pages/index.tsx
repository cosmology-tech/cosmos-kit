import { useWallet } from "@cosmos-kit/react";
import { chainInfos } from "../config";
import { Box, Center, Grid, GridItem, Icon, Stack, useColorModeValue } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Astronaut, Error, ChainOption, ChooseChain, Connected, ConnectedShowAddress, ConnectedUserInfo, Connecting, ConnectStatusWarn, CopyAddressBtn, Disconnected, handleSelectChainDropdown, NotExist, Rejected, RejectedWarn, WalletConnectComponent } from "../components";
import { getWalletPrettyName } from "@cosmos-kit/config";

const Home = () => {
  const walletManager = useWallet();
  const { connect, disconnect, openView, setCurrentChain,
    walletStatus, username, address, message,
    currentChainName: chainName, currentWalletName } = walletManager;
  
  const walletPrettyName = getWalletPrettyName(currentWalletName);

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    openView();
    await connect();
  };

  const onClickDisconnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    openView();
    // await disconnect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  const onChainChange: handleSelectChainDropdown = async (
    selectedValue: ChainOption | null
  ) => {
    setCurrentChain(selectedValue?.chainName);
    openView();
    if (currentWalletName) {
      await connect();
    }
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={
          currentWalletName
            ? onClickConnect
            : onClickOpenView
        } />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={
          address
            // ? `${address.slice(0, 7)}...${address.slice(-4)}`
            ? `${walletPrettyName}`
            : "Disconnect"
        } onClick={
          address
            ? onClickOpenView
            : onClickDisconnect
        } />
      }
      rejected={
        <Rejected
          buttonText="Reconnect"
          onClick={onClickConnect}
        />
      }
      error={
        <Error
          buttonText="Change Wallet"
          onClick={onClickOpenView}
        />
      }
      notExist={<NotExist buttonText="Install Wallet" onClick={onClickOpenView} />}
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${walletPrettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${walletPrettyName}: ${message}`}
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
