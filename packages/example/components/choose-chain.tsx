import { useState, useEffect } from "react";
import { ChangeChainDropdown } from "./chain-dropdown";
import {
  ChooseChainRecord,
  ChainOption,
  handleSelectChainDropdown,
} from "./types";

export function ChooseChain({
  chainName,
  chainRecords,
  onChange,
}: {
  chainName?: string;
  chainRecords: ChooseChainRecord[];
  onChange: handleSelectChainDropdown;
}) {
  const [selectedItem, setSelectedItem] = useState<ChainOption | undefined>();
  useEffect(() => {
    if (chainName && chainRecords.length > 0)
      setSelectedItem(
        chainRecords.filter((options) => options.chainName === chainName)[0]
      );
    if (!chainName) setSelectedItem(undefined);
  }, [chainName]);
  return (
    <ChangeChainDropdown
      data={chainRecords}
      selectedItem={selectedItem}
      onChange={onChange}
    />
  );
}
