import { Box } from '@chakra-ui/react';
import {
  ConnectWalletButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';

export const Rejected = ({
  onClose,
  onReturn,
  onReconnect,
  logo,
  name,
  message,
}: {
  onClose: () => void;
  onReturn: () => void;
  onReconnect: () => void;
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
      contentHeader={'Request Rejected'}
      contentDesc={message}
      bottomButton={
        <Box px={6}>
          <ConnectWalletButton buttonText={'Reconnect'} onClick={onReconnect} />
        </Box>
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
