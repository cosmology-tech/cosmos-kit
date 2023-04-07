import { Box } from '@chakra-ui/react';
import {
  ConnectWalletButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';
import React from 'react';

export const ErrorView = ({
  onClose,
  onReturn,
  walletInfo,
  message,
}: WalletViewProps) => {
  const { prettyName, logo } = walletInfo;

  const modalHead = (
    <SimpleModalHead
      title={prettyName}
      backButton={true}
      onClose={onClose}
      onBack={onReturn}
    />
  );

  const modalContent = (
    <SimpleDisplayModalContent
      status={LogoStatus.Error}
      logo={logo}
      contentHeader={'Oops! Something wrong...'}
      contentDesc={message}
      bottomButton={
        <Box px={6}>
          <ConnectWalletButton
            buttonText={'Change Wallet'}
            onClick={onReturn}
          />
        </Box>
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
