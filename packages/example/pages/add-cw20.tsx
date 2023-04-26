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
import { useMemo } from "react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";

const chainName = "juno";

export default () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    username,
    chain,
    connect,
    disconnect,
    wallet,
    status,
    assets,
    suggestToken,
  } = useChain(chainName);

  /**
   * Retrieve the first CW20 to provide an example
   */
  const cw20Tokens = useMemo(() => {
    if (assets) {
      return assets.assets
        .filter((asset) => asset.type_asset === "cw20")
        .slice(0, 1);
    }

    return [];
  }, [assets]);

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
          <Button
            colorScheme="teal"
            disabled={cw20Tokens.length === 0 || !chain}
            onClick={() => {
              if (chain) {
                suggestToken({
                  chainId: chain.chain_id,
                  chainName: chain.chain_name,
                  type: "cw20",
                  tokens: cw20Tokens.map(token => ({
                    contractAddress: token.address ?? ''
                  })),
                });
              }
            }}
          >
            Suggest Tokens
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
          {chainName}
        </Heading>
        {getConnectButton()}
      </VStack>
    </SimpleGrid>
  );
};
