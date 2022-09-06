import { useWallet } from "@cosmos-kit/react";
import { getWalletStatusFromState } from "@/utils";
import { chainInfos } from "@/config";
import { Box, Center, Grid, GridItem, Icon, Stack, useColorModeValue } from "@chakra-ui/react";
import { MouseEventHandler, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Astronaut, ChainOption, ChooseChain, Connected, ConnectedShowAddress, ConnectedUserInfo, Connecting, ConnectStatusWarn, CopyAddressBtn, Disconnected, handleSelectChainDropdown, NotExist, Rejected, RejectedWarn, WalletConnectComponent } from "../components";

const Home = () => {
  const [chainName, setChainName] = useState<string | undefined>();
  const { connect, disconnect, state, username, address } = useWallet(chainName);

  const walletStatus = getWalletStatusFromState(state);
  // console.log(chainName, state, walletStatus)

  // Events
  const onClickConnect: MouseEventHandler = (e) => {
    e.preventDefault();
    connect();
  };

  const onClickDisconnect: MouseEventHandler = (e) => {
    e.preventDefault();
    disconnect();
  };

  const onChainChange: handleSelectChainDropdown = (
    selectedValue: ChainOption | null
  ) => {
    setChainName(selectedValue?.chainName);
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText="Disconnect" onClick={onClickDisconnect} />
      }
      rejected={
        <Rejected
          buttonText="Chain Rejected"
        />
      }
      notExist={<NotExist buttonText="Not Exist" />}
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning="Warning: There is not enough chain information to connect to this chain."
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
