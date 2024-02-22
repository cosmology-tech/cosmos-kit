import * as React from "react";
import {
  Box,
  Combobox,
  Text,
  Stack,
  Avatar,
  Skeleton,
  ThemeProvider,
  useTheme,
} from "@interchain-ui/react";
import { search } from "fast-fuzzy";

type Option = {
  label: string;
  value: string;
};

export interface ChainInfo {
  chainName: string;
  chainRoute?: string;
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export interface ChooseChainProps {
  chainName?: string;
  chainInfos: ChainInfo[];
  onChange: (selectedItem: Option | null) => void;
}

const ChainOption = (props: Option & { iconUrl: string }) => {
  return (
    <Stack
      direction="horizontal"
      space="$4"
      attributes={{ alignItems: "center", height: "$full" }}
    >
      <Avatar
        name={props.label}
        getInitials={(name) => name[0]}
        size="sm"
        src={props.iconUrl}
        fallbackMode="bg"
      />

      <Text fontSize="$md" fontWeight="$normal" color="$text">
        {props.label}
      </Text>
    </Stack>
  );
};

export const ChooseChain = (props: ChooseChainProps) => {
  const { chainName, chainInfos, onChange } = props;
  const [selectedKey, setSelectedKey] = React.useState<React.Key>();
  const { themeClass } = useTheme();
  let [filterValue, setFilterValue] = React.useState<string>("");

  React.useEffect(() => {
    // Init selected key to provided chainName
    if (chainName && chainInfos.length > 0) {
      const defaultChain = chainInfos.filter(
        (options) => options.chainName === chainName
      )[0];

      setSelectedKey(defaultChain.value);
      return setFilterValue(defaultChain.label);
    }

    if (!chainName) setSelectedKey(undefined);
  }, [chainInfos, chainName]);

  let filteredItems = React.useMemo(() => {
    const initialItems = chainInfos
      .map((chainInfo) => ({
        iconUrl: chainInfo.icon,
        label: chainInfo.label,
        value: chainInfo.value,
      }))
      .filter((chainInfo) => chainInfo.label && chainInfo.value);

    if (!filterValue) return initialItems;

    const filtered = search(filterValue, initialItems, {
      keySelector(s) {
        return [s.label, s.value];
      },
    });

    return filtered;
  }, [chainInfos, filterValue]);

  const avatarUrl =
    filteredItems.find((i) => i.value === selectedKey)?.iconUrl ?? undefined;

  return (
    <ThemeProvider>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={themeClass}
      >
        <Combobox
          size="md"
          items={filteredItems}
          inputValue={filterValue}
          openOnFocus
          onInputChange={(value) => {
            setFilterValue(value);

            if (!value) {
              return setSelectedKey(undefined);
            }
          }}
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
            selectedKey && avatarUrl ? (
              <Avatar
                name={selectedKey as string}
                getInitials={(name) => name[0]}
                size="sm"
                src={avatarUrl}
                fallbackMode="bg"
                attributes={{
                  paddingX: "$4",
                }}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                px="$4"
              >
                <Skeleton width="32px" height="32px" borderRadius="$full" />
              </Box>
            )
          }
          styleProps={{
            width: {
              mobile: "100%",
              mdMobile: "350px",
            },
          }}
        >
          {filteredItems.map((option) => (
            <Combobox.Item key={option.value} textValue={option.label}>
              <ChainOption
                iconUrl={option.iconUrl ?? ""}
                label={option.label}
                value={option.value}
              />
            </Combobox.Item>
          ))}
        </Combobox>
      </Box>
    </ThemeProvider>
  );
};
