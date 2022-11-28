import { Center, List } from "@chakra-ui/react";

import { SingleWalletSection } from "../components";

const chainNames = ["cosmoshub", "osmosis", "stargaze", "chihuahua"];

export default function () {
  return (
    <Center py={16}>
      <List spacing={3}>
        {chainNames.map((chainName) => {
          return <SingleWalletSection key={chainName} chainName={chainName} />;
        })}
      </List>
    </Center>
  );
}
