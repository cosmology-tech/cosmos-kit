import {
  SimpleModalHead,
  QRCode as SimpleQRCode,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';

export const LoadingQRCode = ({
  onClose,
  onReturn,
  name,
}: {
  onClose: () => void;
  onReturn: () => void;
  name: string;
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
    <SimpleQRCode
      link={''}
      description={`Open ${name} App to Scan`}
      loading={true}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
