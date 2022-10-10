import { useWallet } from "@cosmos-kit/react";
import { Box, Center, Grid, GridItem, Icon, Stack, useColorModeValue } from "@chakra-ui/react";
import { MouseEventHandler, useMemo } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Astronaut, Error, ChainOption, ChooseChain, Connected, ConnectedShowAddress, ConnectedUserInfo, Connecting, ConnectStatusWarn, CopyAddressBtn, Disconnected, handleSelectChainDropdown, NotExist, Rejected, RejectedWarn, WalletConnectComponent, ChooseChainInfo } from "../components";
import { assets as chainAssets } from 'chain-registry';


const Home = () => {
  const walletManager = useWallet();
  const { 
    connect, 
    openView, 
    disconnect, 
    setCurrentChain, 
    chains,
    walletStatus, 
    username, 
    address, 
    message,
    currentChainName: chainName,
    currentWallet 
  } = walletManager;

  const walletPrettyName = currentWallet?.walletInfo.prettyName;

  const chainOptions = useMemo(() => (
    chains
      .map((chainRecord) => {
        const assets = chainAssets.find(
          _chain => _chain.chain_name === chainRecord.name
        )?.assets;
        return {
          chainName: chainRecord.name,
          label: chainRecord.chain.pretty_name,
          value: chainRecord.name,
          icon: assets ? assets[0]?.logo_URIs?.svg || assets[0]?.logo_URIs?.png : undefined,
          disabled: false
        }
      })
  ), [chains])

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  const onClickDisconnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await disconnect();
  };

  const onChainChange: handleSelectChainDropdown = async (
    selectedValue: ChainOption | null
  ) => {
    setCurrentChain(selectedValue?.chainName);
    await connect();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={<Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />}
      connecting={<Connecting />}
      connected={<Connected buttonText={"My Wallet"} onClick={onClickOpenView} />}
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
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
      chainOptions={chainOptions}
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
