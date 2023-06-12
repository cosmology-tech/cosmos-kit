import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  StackDivider,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useChain, useModalTheme, useWallet } from "@cosmos-kit/react";
import React, { useEffect } from "react";
import { useCallback } from "react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";

import { ChainWalletCard } from "../components";

// const chainNames_1 = ["cosmoshub"];
// const chainNames_2: string[] = ["cosmoshub"];

const chainNames_1 = ["osmosis", "cosmoshub"];
const chainNames_2 = ["stargaze", "chihuahua"];

// const chainNames_1 = ["coreum"];
// const chainNames_2 = [];

export default () => {
  const { colorMode, setColorMode } = useColorMode();
  const { username, connect, disconnect, wallet } = useChain(chainNames_1[0]);
  const { modalTheme, setModalTheme } = useModalTheme();
  const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)

  useEffect(() => {
    const fn = async () => {
      await mainWallet?.connect();
      console.log(
        "%cindex.tsx line:42 mainWallet.walletStatus",
        "color: #007acc;",
        mainWallet?.walletStatus
      );
    };
    fn();
  }, []);

  const toggleTheme = useCallback(() => {
    switch (modalTheme) {
      case "light":
        // setColorMode("dark");
        setModalTheme("dark");
        break;
      case "dark":
        // setColorMode("light");
        setModalTheme("light");
        break;
      default:
        throw new Error(`Unknown modalTheme: ${modalTheme}`);
    }
  }, [setColorMode, setModalTheme, colorMode, modalTheme]);

  const addressInModal = chainNames_1.map((chainName) => {
    return (
      <ChainWalletCard
        key={chainName}
        chainName={chainName}
        type="address-in-modal"
      />
    );
  });

  const addressOnPage = chainNames_2.map((chainName) => {
    return (
      <ChainWalletCard
        key={chainName}
        chainName={chainName}
        type="address-on-page"
      />
    );
  });

  const getGlobalButton = () => {
    if (globalStatus === "Connecting") {
      return (
        <Button
          isLoading
          loadingText={`Connecting ${wallet?.prettyName}`}
          colorScheme="teal"
          size="md"
          marginTop={6}
          marginBottom={2}
        />
      );
    }
    if (globalStatus === "Connected") {
      return (
        <ButtonGroup
          size="md"
          isAttached
          variant="solid"
          marginTop={6}
          marginBottom={2}
        >
          <Button
            leftIcon={<IoWalletOutline />}
            isActive={true}
            variant="outline"
          >
            {wallet?.prettyName}
          </Button>
          <Button leftIcon={<FaUserCircle />} isActive={true} variant="outline">
            {username}
          </Button>
          <Button
            colorScheme="teal"
            onClick={async () => {
              await disconnect();
              // setGlobalStatus(WalletStatus.Disconnected);
            }}
          >
            Disconnect
          </Button>
        </ButtonGroup>
      );
    }

    return (
      <Button
        isLoading={false}
        loadingText={`Connecting ${wallet?.prettyName}`}
        colorScheme="teal"
        size="md"
        marginTop={6}
        marginBottom={2}
        onClick={() => connect()}
      >
        Connect Wallet
      </Button>
    );
  };

  return (
    <SimpleGrid columns={1} spacing={10} maxW={"60%"} marginX="auto">
      <Flex justifyContent="end">
        <Button variant="outline" px={0} onClick={toggleTheme}>
          <Icon
            as={colorMode === "light" ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
      </Flex>
      <VStack spacing="24px" marginTop={-2}>
        <Heading size="lg" marginBottom={3}>
          ChainProvider Test
        </Heading>
        {getGlobalButton()}
      </VStack>
      <Card>
        <CardHeader>
          <Heading size="md">Address Card in Modal</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {addressInModal}
          </Stack>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Heading size="md">Address Card on Page</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {addressOnPage}
          </Stack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
