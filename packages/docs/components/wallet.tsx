import { useManager } from "@cosmos-kit/react";
import { ThemeProvider, useTheme, Box } from "@interchain-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  ChainOption,
  ChooseChain,
  handleSelectChainDropdown,
  ConnectWalletButton,
} from ".";
import { ChainName } from "@cosmos-kit/core";
import { WalletCardSection } from "./card";

export const WalletSection = () => {
  const { themeClass } = useTheme();

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

  useEffect(() => {
    setChainName(window.localStorage.getItem("selected-chain") || "cosmoshub");
  }, []);

  const onChainChange: handleSelectChainDropdown = async (
    selectedValue: ChainOption | null
  ) => {
    setChainName(selectedValue?.chainName);
    if (selectedValue?.chainName) {
      window?.localStorage.setItem("selected-chain", selectedValue?.chainName);
    } else {
      window?.localStorage.removeItem("selected-chain");
    }
  };

  return (
    <ThemeProvider>
      <div className={themeClass}>
        <Box py="$8" display="flex" justifyContent="center" alignItems="center">
          <Box
            display="grid"
            width="$full"
            maxWidth="400px"
            gridTemplateColumns="1fr"
            rowGap="$8"
            alignItems="center"
            justifyContent="center"
          >
            <ChooseChain
              chainName={chainName}
              chainInfos={chainOptions}
              onChange={onChainChange}
            />

            {chainName ? (
              <WalletCardSection chainName={chainName}></WalletCardSection>
            ) : (
              <ConnectWalletButton buttonText={"Connect Wallet"} isDisabled />
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};
