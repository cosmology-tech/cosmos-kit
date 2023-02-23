import {
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';
import React from 'react';

export const ConnectingView = ({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps) => {
  const {
    walletInfo: { prettyName, logo, mode },
    message,
  } = wallet;

  let title: string = 'Requesting Connection';
  let desc: string =
    mode === 'wallet-connect'
      ? `Approve ${prettyName} connection request on your mobile.`
      : `Open the ${prettyName} browser extension to connect your wallet.`;

  if (message === 'InitClient') {
    title = 'Initializing Wallet Client';
    desc = '';
  }

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
      status={LogoStatus.Loading}
      logo={logo}
      contentHeader={title}
      contentDesc={desc}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
