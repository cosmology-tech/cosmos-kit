import { Button, Icon } from '@chakra-ui/react';
import React from 'react';
import { IoWallet } from 'react-icons/io5';

import { ConnectWalletType } from '../types';

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  icon,
  onClickConnectBtn,
}: ConnectWalletType) => {
  return (
    <Button
      px={2}
      w="full"
      minW={48}
      colorScheme="primary"
      size="lg"
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={onClickConnectBtn}
    >
      <Icon as={icon ? icon : IoWallet} mr={2} />
      {buttonText ? buttonText : 'Connect Wallet'}
    </Button>
  );
};
