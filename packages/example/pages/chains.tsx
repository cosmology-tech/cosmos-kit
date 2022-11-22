import { List, ListIcon, ListItem } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { MdCheckCircle } from "react-icons/md";
import { VscError } from "react-icons/vsc";

const chainNames = ["cosmoshub", "osmosis", "stargaze"];

export default function () {
  return (
    <List spacing={3}>
      {chainNames.map((chainName) => {
        const { isError, chainInfo, address } = useChain(chainName);
        const icon = isError ? VscError : MdCheckCircle;
        const color = isError ? "red.500" : "green.500";
        return (
          <ListItem>
            <ListIcon as={icon} color={color} />
            {chainInfo.chain.pretty_name}: {address}
          </ListItem>
        );
      })}
    </List>
  );
}
