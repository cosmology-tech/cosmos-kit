import { Box } from '@chakra-ui/react';
import {
  ConnectWalletButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';

export const Error = ({
  onClose,
  onReturn,
  onChangeWallet,
  logo,
  name,
  message,
}: {
  onClose: () => void;
  onReturn: () => void;
  onChangeWallet: () => void;
  logo?: string;
  name: string;
  message: string;
}) => {
  const modalHead = (
    <SimpleModalHead
      title={name}
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
            onClick={onChangeWallet}
          />
        </Box>
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
