import { Box, Icon } from '@chakra-ui/react';
import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { ConnectedWalletViewProps } from '@cosmos-kit/core';
import React, { useCallback } from 'react';
import { RiDoorOpenFill } from 'react-icons/ri';

export const ConnectedView = ({
  onClose,
  onReturn,
  walletInfo,
  wallets,
}: ConnectedWalletViewProps) => {
  const { prettyName, logo } = walletInfo;

  const onDisconnect = useCallback(() => {
    wallets.forEach((w) => w.disconnect());
  }, [wallets]);

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
      username={wallets[0]?.username}
      walletIcon={logo}
      addressButton={
        <div>
          {wallets.map((w) => (
            <CopyAddressButton address={w.address} key={w.chainName} />
          ))}
        </div>
      }
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
