import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { ChainName } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { ConnectedShowAddress } from "./react";

export const ChainWalletCard = ({
  chainName,
  type = "address-on-page",
}: {
  chainName: ChainName;
  type: string;
}) => {
  const { chain, status, address, openView } = useChain(chainName);

  switch (type) {
    case "address-in-modal":
      return (
        <HStack spacing="24px">
          <Heading size="xs" textTransform="uppercase" minW={150}>
            {chain.pretty_name}
          </Heading>
          <Button
            isLoading={status === "Connecting"}
            colorScheme="teal"
            size="sm"
            marginTop={6}
            marginBottom={2}
            onClick={openView}
          >
            View Address
          </Button>
        </HStack>
      );
    case "address-on-page":
      return (
        <HStack spacing="24px">
          <Heading size="xs" textTransform="uppercase" minW={150}>
            {chain.pretty_name}
          </Heading>
          <Box width={"full"} maxW={260}>
            <ConnectedShowAddress
              address={address}
              isLoading={status === "Connecting"}
              isRound={true}
              size={"sm"}
            />
          </Box>
        </HStack>
      );
    default:
      throw new Error("No such chain card type: " + type);
  }
};
