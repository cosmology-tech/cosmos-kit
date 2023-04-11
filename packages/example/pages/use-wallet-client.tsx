import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { WalletAccount } from "@cosmos-kit/core";
import { useWalletClient } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

const chainIds = ["cosmoshub-4", "osmosis-1", "stargaze-1", "chihuahua-1"];
interface DataType extends WalletAccount {
  chainId: string;
}

export default () => {
  const { client, status } = useWalletClient("keplr-extension");
  const [data, setData] = useState<(undefined | DataType)[]>();

  useEffect(() => {
    if (status === "Done") {
      Promise.all(
        chainIds.map(async (chainId) => {
          const account = await client!.getAccounts!(chainId);
          return {
            ...account,
            chainId,
          } as DataType;
        })
      )
        .then((v) => {
          setData(v);
        })
        .catch((e) => console.error(e));
    }
  }, [status]);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Chain ID</Th>
            <Th>Address</Th>
            <Th>Algo</Th>
            <Th>Public Key</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map((d) => (
              <Tr key={d!.chainId}>
                <Td>{d!.username}</Td>
                <Td>{d!.chainId}</Td>
                <Td>{d!.address}</Td>
                <Td>{d!.algo}</Td>
                <Td>{Buffer.from(d!.pubkey).toString("hex")}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
