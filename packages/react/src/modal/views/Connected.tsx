import { Box, Icon } from '@chakra-ui/react';
import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';
import { RiDoorOpenFill } from 'react-icons/ri';

export const Connected = ({
  onClose,
  onReturn,
  onDisconnect,
  name,
  logo,
  username,
  address,
}: {
  onClose: () => void;
  onReturn: () => void;
  onDisconnect: () => void;
  name: string;
  logo: string;
  username?: string;
  address?: string;
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
      logo={Astronaut}
      username={username}
      walletIcon={(typeof logo === 'string' && logo) || void 0}
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
