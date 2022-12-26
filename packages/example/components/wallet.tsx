import {
  Box,
  Center,
  Grid,
  GridItem,
  Icon,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useIcnsNames } from "@cosmos-kit/icns";
import { useWallet } from "@cosmos-kit/react";
import { MouseEventHandler, useMemo } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import {
  Astronaut,
  ChainOption,
  ChooseChain,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  Error,
  handleSelectChainDropdown,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from "../components";

export const WalletSection = () => {
  const walletManager = useWallet();
  const {
    connect,
    openView,
    walletStatus,
    username,
    address,
    message,
    currentChainName,
    currentWallet,
    chainRecords,
    getChainLogo,
    setCurrentChain,
  } = walletManager;

  const chainOptions = useMemo(
    () =>
      chainRecords.map((chainRecord) => {
        return {
          chainName: chainRecord?.name,
          label: chainRecord?.chain.pretty_name,
          value: chainRecord?.name,
          icon: getChainLogo(chainRecord.name),
        };
      }),
    [chainRecords, getChainLogo]
  );

  const { icnsNames, isLoading } = useIcnsNames();

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
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
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={"My Wallet"} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickConnect} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickConnect} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
        />
      }
    />
  );
  const chooseChain = (
    <ChooseChain
      chainName={currentChainName}
      chainOptions={chainOptions}
      onChange={onChainChange}
    />
  );

  const userInfo = isLoading ? (
    <Spinner></Spinner>
  ) : (
    <ConnectedUserInfo
      username={icnsNames?.primaryName || username}
      icon={<Astronaut />}
    />
  );

  const addressBtn = currentChainName && (
    <CopyAddressBtn
      walletStatus={walletStatus}
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
};
