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
  loading,
}: {
  onClose: () => void;
  onReturn: () => void;
  qrUrl?: string;
  name: string;
  loading: boolean;
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
      loading={loading}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
