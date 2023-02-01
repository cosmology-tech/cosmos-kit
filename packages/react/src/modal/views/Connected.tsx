import { Box, Icon } from '@chakra-ui/react';
import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  SimpleConnectModal,
  SimpleDisplayModalContent,
  SimpleModalHead,
} from '@cosmology-ui/react';
import { useRef } from 'react';
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
  const initialFocus = useRef();

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

  return (
    <SimpleConnectModal
      modalOpen={true}
      modalOnClose={onClose}
      modalHead={modalHead}
      modalContent={modalContent}
      initialRef={initialFocus}
    />
  );
};
