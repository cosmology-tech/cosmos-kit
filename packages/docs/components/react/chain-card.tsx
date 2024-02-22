import Image from "next/image";
import { Text, Box, useTheme } from "@interchain-ui/react";

interface IChainCard {
  prettyName: string;
  icon?: string;
}

export const ChainCard = (props: IChainCard) => {
  const { theme } = useTheme();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="$4"
      overflow="hidden"
      wordBreak="break-word"
      color={theme === "light" ? "$blackAlpha800" : "$whiteAlpha800"}
      width="100%"
    >
      <Box
        minWidth="$10"
        minHeight="$10"
        maxWidth="$10"
        maxHeight="$10"
        width="100%"
        height="100%"
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme === "light" ? "$blackAlpha200" : "$whiteAlpha200"}
        border="1px solid"
        borderRadius="$full"
        overflow="hidden"
      >
        <Image
          width={24}
          height={24}
          alt="chain icon"
          src={props.icon ?? "https://dummyimage.com/150/9e9e9e/ffffff&text=☒"}
        />
      </Box>

      <Text fontSize="$xl" fontWeight="$semibold">
        {props.prettyName}
      </Text>
    </Box>
  );
};
