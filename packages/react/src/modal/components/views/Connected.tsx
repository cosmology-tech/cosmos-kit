import { Box, Icon } from '@chakra-ui/react';
import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';
import React, { useCallback } from 'react';
import { RiDoorOpenFill } from 'react-icons/ri';

export const ConnectedView = ({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps) => {
  const {
    walletInfo: { prettyName, logo },
    username,
    address,
  } = wallet;

  const onDisconnect = useCallback(() => wallet.disconnect(true), [wallet]);

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
      logo={Astronaut}
      username={username}
      walletIcon={logo}
      addressButton={<CopyAddressButton address={address} />}
      bottomButton={
        <Box px={6}>
          <ConnectWalletButton
            leftIcon={<Icon as={RiDoorOpenFill} />}
            buttonText={'Disconnect'}
            onClick={onDisconnect}
          />
        </Box>
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
