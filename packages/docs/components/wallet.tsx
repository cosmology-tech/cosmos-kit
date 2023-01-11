import { useManager } from "@cosmos-kit/react";
import { Center, Grid, GridItem } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  ChainOption,
  ChooseChain,
  handleSelectChainDropdown,
  ConnectWalletButton,
} from ".";
import { ChainName } from "@cosmos-kit/core";
import { WalletCardSection } from "./card";

export const WalletSection = () => {
  const [chainName, setChainName] = useState<ChainName | undefined>(
    "cosmoshub"
  );
  const { chainRecords, getChainLogo } = useManager();

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

  const onChainChange: handleSelectChainDropdown = async (
    selectedValue: ChainOption | null
  ) => {
    setChainName(selectedValue?.chainName);
  };

  const chooseChain = (
    <ChooseChain
      chainName={chainName}
      chainInfos={chainOptions}
      onChange={onChainChange}
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
        {chainName ? (
          <WalletCardSection chainName={chainName}></WalletCardSection>
        ) : (
          <ConnectWalletButton buttonText={"Connect Wallet"} isDisabled />
        )}
      </Grid>
    </Center>
  );
};
