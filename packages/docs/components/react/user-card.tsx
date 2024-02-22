import * as React from "react";
import { Text, Stack, Box } from "@interchain-ui/react";
import { ConnectedUserCardType } from "../types";

export const ConnectedUserInfo = ({
  username,
  icon,
}: ConnectedUserCardType) => {
  return (
    <Stack
      direction="vertical"
      space="$1"
      attributes={{
        alignItems: "center",
      }}
    >
      {username && (
        <>
          <Box
            display={icon ? "block" : "none"}
            width={{
              mobile: "$12",
              tablet: "$16",
            }}
            height={{
              mobile: "$12",
              tablet: "$16",
            }}
            borderRadius="$full"
            overflow="hidden"
          >
            {icon}
          </Box>

          <Text
            fontSize={{ mobile: "$sm", tablet: "$xl" }}
            fontWeight="$semibold"
          >
            {username}
          </Text>
        </>
      )}
    </Stack>
  );
};
