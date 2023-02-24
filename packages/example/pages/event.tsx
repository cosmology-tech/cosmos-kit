import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  HStack,
  ListItem,
  OrderedList,
  VStack,
} from "@chakra-ui/react";
import { useChain, useManager } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { ConnectedShowAddress } from "../components";

const chainName = "cosmoshub";

export default () => {
  const { chain, status, address, connect } = useChain(chainName);
  const { on, off } = useManager();
  const [list, setList] = useState<string[]>([]);

  const handler = () => {
    list.push("trigger event refresh_connection");
    setList(list);
  };

  useEffect(() => {
    on("refresh_connection", handler);
    return () => {
      off("refresh_connection", handler);
    };
  }, []);

  return (
    <VStack marginTop={100} spacing={30} align="start" marginLeft={50}>
      <HStack spacing="24px">
        <Heading size="xs" textTransform="uppercase" minW={100}>
          {chain.pretty_name}
        </Heading>
        <Button
          isLoading={status === "Connecting"}
          colorScheme="teal"
          size="sm"
          marginTop={6}
          marginBottom={2}
          onClick={() => connect()}
          width={180}
        >
          Open Modal
        </Button>
        <Box width={"full"} maxW={260}>
          <ConnectedShowAddress
            address={address}
            isLoading={status === "Connecting"}
            isRound={true}
            size={"sm"}
          />
        </Box>
      </HStack>
      <Card minWidth={530} minHeight={100}>
        <CardBody>
          <OrderedList>
            {list.map((value, index) => (
              <ListItem key={index}>{value}</ListItem>
            ))}
          </OrderedList>
        </CardBody>
      </Card>
    </VStack>
  );
};
