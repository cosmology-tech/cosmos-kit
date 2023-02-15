import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";

export default () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { username, connect, disconnect, wallet, status } = useChain(
    "cosmoshub"
  );

  const getConnectButton = () => {
    if (status === "Connecting") {
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
    if (status === "Connected") {
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
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={colorMode === "light" ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
      </Flex>
      <VStack spacing="24px" marginTop={-2}>
        <Heading size="lg" marginBottom={3}>
          Cosmos Hub
        </Heading>
        {getConnectButton()}
      </VStack>
    </SimpleGrid>
  );
};
