import {
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';

export const Connecting = ({
  onClose,
  onReturn,
  name,
  logo,
  title,
  subtitle,
}: {
  onClose: () => void;
  onReturn: () => void;
  name: string;
  logo: string;
  title: string;
  subtitle: string;
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
      status={LogoStatus.Loading}
      logo={logo}
      contentHeader={title}
      contentDesc={subtitle}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
