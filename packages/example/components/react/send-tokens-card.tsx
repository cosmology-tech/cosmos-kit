import React, { MouseEventHandler, ReactNode } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import { WalletStatus } from "@cosmos-kit/core";

import { ConnectWalletType } from "../types";
import { handleChangeColorModeValue } from "./handleChangeColor";

export const SendTokensCard = ({
  balance,
  response,
  isFetchingBalance,
  isConnectWallet,
  getBalanceButtonText,
  handleClickGetBalance,
  sendTokensButtonText,
  handleClickSendTokens,
}: {
  balance: number;
  response?: string;
  isFetchingBalance: boolean;
  isConnectWallet: boolean;
  sendTokensButtonText?: string;
  handleClickSendTokens: () => void;
  getBalanceButtonText?: string;
  handleClickGetBalance: () => void;
}) => {
  const { colorMode } = useColorMode();
  if (!isConnectWallet) {
    return (
      <Box boxShadow="0 0 2px #ccc, 0 0 5px -1px #ccc" borderRadius="lg" p={5}>
        <Heading
          as="h3"
          textAlign="center"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="extrabold"
          color="primary.400"
          m={30}
        >
          Please Connect Your Wallet!
        </Heading>
      </Box>
    );
  }
  return (
    <Stack
      boxShadow={handleChangeColorModeValue(
        colorMode,
        "0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3",
        "0 0 2px #212121, 0 0 6px -2px #8a8a8a"
      )}
      borderRadius="lg"
      w="full"
      maxW="md"
      p={6}
      pt={10}
      spacing={6}
    >
      <Stack
        isInline={true}
        justifyContent="space-between"
        alignItems="center"
        bg={handleChangeColorModeValue(
          colorMode,
          "blackAlpha.50",
          "blackAlpha.300"
        )}
        borderRadius="md"
        border="1px solid"
        borderColor={handleChangeColorModeValue(
          colorMode,
          "gray.300",
          "gray.600"
        )}
        p={4}
      >
        <Text>
          Balance:&ensp;
          <Text
            as="span"
            color={handleChangeColorModeValue(
              colorMode,
              "primary.500",
              "primary.200"
            )}
            fontWeight="semibold"
            fontSize="xl"
          >
            {balance}
          </Text>
        </Text>
        <Button
          size="sm"
          bg={handleChangeColorModeValue(
            colorMode,
            "whiteAlpha.900",
            "blackAlpha.500"
          )}
          isLoading={isFetchingBalance}
          variant="outline"
          onClick={handleClickGetBalance}
        >
          {getBalanceButtonText || "Fetch Balance"}
        </Button>
      </Stack>
      <Center>
        <Button
          variant="outline"
          colorScheme="primary"
          onClick={handleClickSendTokens}
        >
          {sendTokensButtonText || "Send Tokens (to self)"}
        </Button>
      </Center>
      {response && (
        <Stack>
          <Text fontWeight="medium">Result</Text>
          <Box
            border="1px solid"
            borderColor={handleChangeColorModeValue(
              colorMode,
              "gray.300",
              "gray.600"
            )}
            bg="rgba(0, 0, 0, 0.01)"
            borderRadius="md"
            opacity={0.8}
            overflowX="scroll"
            p={4}
            css={{
              // For Firefox
              scrollbarWidth: "auto",
              scrollbarColor: handleChangeColorModeValue(
                colorMode,
                "rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.2)",
                "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1)"
              ),
              // For Chrome and other browsers except Firefox
              "&::-webkit-scrollbar": {
                height: "8px",
                background: handleChangeColorModeValue(
                  colorMode,
                  "rgba(220, 220, 220, 0.01)",
                  "rgba(0, 0, 0, 0.01)"
                ),
                borderRadius: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: handleChangeColorModeValue(
                  colorMode,
                  "rgba(0, 0, 0, 0.1)",
                  "rgba(255, 255, 255, 0.1)"
                ),
                borderRadius: "6px",
                border: "2px solid transparent",
                backgroundClip: "content-box",
              },
            }}
          >
            <pre>{response}</pre>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
