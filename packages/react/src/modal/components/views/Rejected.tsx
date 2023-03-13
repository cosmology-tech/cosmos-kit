import { Box } from '@chakra-ui/react';
import {
  ConnectWalletButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';
import React, { useCallback } from 'react';

export const RejectedView = ({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps) => {
  const {
    walletInfo: { prettyName, logo },
  } = wallet;

  const onReconnect = useCallback(() => {
    wallet.connect(false);
  }, [wallet]);

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
      contentHeader={'Request Rejected'}
      contentDesc={
        wallet.rejectMessageTarget || 'Connection permission is denied.'
      }
      bottomButton={
        <Box px={6}>
          <ConnectWalletButton buttonText={'Reconnect'} onClick={onReconnect} />
        </Box>
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
