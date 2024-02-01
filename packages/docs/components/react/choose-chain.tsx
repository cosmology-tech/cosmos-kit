import * as React from "react";
import { Combobox, Box, Avatar, Stack, Text } from "@interchain-ui/react";
import { ChooseChainInfo, handleSelectChainDropdown } from "../types";

type Option = {
  label: string;
  value: string;
};

const ChainOption = (props: Option & { iconUrl: string }) => {
  return (
    <Stack
      direction="horizontal"
      space="$4"
      attributes={{ alignItems: "center" }}
    >
      <Avatar
        name={props.label}
        getInitials={(name) => name[0]}
        size="xs"
        src={props.iconUrl}
        fallbackMode="bg"
      />

      <Text fontSize="$md" fontWeight="$normal" color="$text">
        {props.label}
      </Text>
    </Stack>
  );
};

export function ChooseChain({
  chainName,
  chainInfos,
  onChange,
}: {
  chainName?: string;
  chainInfos: ChooseChainInfo[];
  onChange: handleSelectChainDropdown;
}) {
  const [selectedKey, setSelectedKey] = React.useState<React.Key>();

  React.useEffect(() => {
    if (chainName && chainInfos.length > 0) {
      setSelectedKey(
        chainInfos.filter((options) => options.chainName === chainName)[0].value
      );
    }

    if (!chainName) setSelectedKey(null);
  }, [chainInfos, chainName]);

  const chainOptions = chainInfos.map((chainInfo) => ({
    iconUrl: chainInfo.icon,
    label: chainInfo.label,
    value: chainInfo.value,
  }));

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Combobox
        selectedKey={selectedKey as string}
        onSelectionChange={(item) => {
          if (item) {
            setSelectedKey(item);

            const found =
              chainInfos.find((options) => options.value === item) ?? null;

            if (found) {
              onChange?.(found);
            }
          }
        }}
        inputAddonStart={
          selectedKey ? (
            <Avatar
              name={selectedKey as string}
              getInitials={(name) => name[0]}
              size="xs"
              src={
                chainOptions.find((i) => i.value === selectedKey)?.iconUrl ??
                undefined
              }
              fallbackMode="bg"
              attributes={{
                paddingX: "$4",
              }}
            />
          ) : null
        }
        styleProps={{
          width: "350px",
        }}
      >
        {chainOptions.map((option) => (
          <Combobox.Item key={option.value} textValue={option.value}>
            <ChainOption
              iconUrl={option.iconUrl}
              label={option.label}
              value={option.value}
            />
          </Combobox.Item>
        ))}
      </Combobox>
    </Box>
  );
}
