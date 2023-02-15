import {
  SimpleModalHead,
  QRCode as SimpleQRCode,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';

export const QRCode = ({
  onClose,
  onReturn,
  qrUrl,
  name,
}: {
  onClose: () => void;
  onReturn: () => void;
  qrUrl?: string;
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
      link={qrUrl || ''}
      description={`Open ${name} App to Scan`}
      loading={false}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
