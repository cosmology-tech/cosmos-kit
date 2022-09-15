import React from "react";
import {
  Text,
  useColorModeValue,
  Button,
  Icon,
  useClipboard,
  Stack,
  Box,
} from "@chakra-ui/react";
import { FaRegCopy } from "react-icons/fa";

export const SimpleCopyAddressButton = ({ address }: { address?: string }) => {
  const { hasCopied, onCopy } = useClipboard(address ? address : "");

  return (
    <Box w="full" px={3}>
      <Button
        borderRadius="full"
        bg={useColorModeValue("white", "blackAlpha.500")}
        boxShadow={useColorModeValue("0 0 2px #ccc", "0 1px 2px #333")}
        w="full"
        h="fit-content"
        px={4}
        py={1.5}
        onClick={() => onCopy()}
        isDisabled={address ? hasCopied : true}
      >
        <Stack isInline={true} spacing={1.5} alignItems="center">
          <Text
            maxW={{ base: 40, md: 48 }}
            position="relative"
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="normal"
            letterSpacing="0.4px"
            verticalAlign="bottom"
            title={address}
            height="1.13em"
            whiteSpace="break-spaces"
            overflow="hidden"
            opacity={0.8}
            _before={{
              content: "attr(title)",
              width: "25%",
              float: "right",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              direction: "rtl",
            }}
            _hover={{
              cursor: "inherit",
            }}
          >
            {address ? address : "address not identified yet"}
          </Text>
          <Icon as={FaRegCopy} w={3} h={3} />
        </Stack>
      </Button>
    </Box>
  );
};
