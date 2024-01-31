import { useState, useEffect } from "react";
import { ChangeChainCombobox } from "@interchain-ui/react";
import { ChooseChainInfo, handleSelectChainDropdown } from "../types";

export function ChooseChain({
  chainName,
  chainInfos,
  onChange,
}: {
  chainName?: string;
  chainInfos: ChooseChainInfo[];
  onChange: handleSelectChainDropdown;
}) {
  const [selectedChain, setSelectedChain] = useState<{
    iconUrl?: string;
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    if (chainName && chainInfos.length > 0) {
      setSelectedChain(
        chainInfos.filter((options) => options.chainName === chainName)[0]
      );
    }

    if (!chainName) setSelectedChain(null);
  }, [chainInfos, chainName]);

  const chainOptions = chainInfos.map((chainInfo) => ({
    iconUrl: chainInfo.icon,
    label: chainInfo.label,
    value: chainInfo.value,
  }));

  return (
    <ChangeChainCombobox
      isLoading={!chainInfos}
      appearance="bold"
      maxHeight={350}
      valueItem={selectedChain ? selectedChain : undefined}
      onItemSelected={(item) => {
        console.log("[Story] Selected Item", item);
        setSelectedChain(item);
        const selected = chainInfos.find((c) => c.label === item.label);
        onChange(selected);
      }}
      options={chainOptions}
    />
  );
}
