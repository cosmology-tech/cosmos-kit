import React, { ReactNode } from 'react';
import {
  Text,
  useColorModeValue,
  Button,
  Icon,
  useClipboard
} from '@chakra-ui/react';
import { FaRegCopy } from 'react-icons/fa';
import { WalletStatus } from '@cosmos-kit/core';

export const ConnectedShowAddress = ({
  address,
  isLoading
}: {
  address?: string;
  isLoading: boolean;
}) => {
  const { hasCopied, onCopy } = useClipboard(address ? address : '');

  return (
    <Button
      borderRadius="full"
      bg={useColorModeValue('white', 'blackAlpha.500')}
      boxShadow={useColorModeValue('0 0 2px #ccc', '0 1px 2px #333')}
      w="fit-content"
      h="fit-content"
      px={4}
      py={1.5}
      onClick={() => onCopy()}
      isLoading={isLoading}
      isDisabled={address ? hasCopied : true}
      rightIcon={<Icon as={FaRegCopy} w={3} h={3} />}
    >
      <Text
        maxW={{ base: 40, md: 48 }}
        position="relative"
        fontSize={{ base: 'xs', md: 'sm' }}
        fontWeight="normal"
        letterSpacing="0.4px"
        title={address}
        height="1.25em"
        whiteSpace="break-spaces"
        overflow="hidden"
        opacity={0.8}
        _before={{
          content: 'attr(title)',
          width: '25%',
          float: 'right',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          direction: 'rtl'
        }}
        _hover={{
          cursor: 'inherit'
        }}
      >
        {address ? address : 'address not identified yet'}
      </Text>
    </Button>
  );
};

export const CopyAddressBtn = ({
  walletStatus,
  connected
}: {
  walletStatus: WalletStatus;
  connected: ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.Connected:
      return <>{connected}</>;
    default:
      return <></>;
  }
};
