import { Button, HStack, Stack, Text, Box } from "@chakra-ui/react";
import { CopyAddressButton } from "@cosmology-ui/react";
import { useChainWallet } from "@cosmos-kit/react";

export default () => {
  const context1 = useChainWallet("cosmoshub", "keplr-extension", false);
  // const context2 = useChainWallet("cosmoshub", "cosmostation-extension", false);
  return (
    <Stack spacing={10} maxW={800} marginX={"auto"} marginTop={100}>
      {[context1].map(({ username, address, connect, wallet }) => (
        <HStack spacing={20} align="center" key={wallet.name}>
          <Text fontSize="md" width={70}>
            {username || "--"}
          </Text>
          <Box width={330}>
            <CopyAddressButton
              address={address}
              loading={false}
              disabled={false}
              maxDisplayLength={14}
            />
          </Box>
          <Button onClick={connect} minW={200}>
            Connect {wallet.prettyName}
          </Button>
        </HStack>
      ))}
    </Stack>
  );
};
