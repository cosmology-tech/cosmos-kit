import { Square } from '@chakra-ui/react';
import {
  SimpleModalHead,
  QRCode as SimpleQRCode,
  SimpleModalView,
  QRCode,
  QRCodeStatus,
} from '@cosmology-ui/react';
import React from 'react';

export const ExpiredQRCode = ({
  onClose,
  onReturn,
  onRefresh,
  qrUrl,
  name,
}: {
  onClose: () => void;
  onReturn: () => void;
  onRefresh: () => void;
  qrUrl: string;
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
    <QRCode
      link={qrUrl}
      status={QRCodeStatus.Expired}
      errorTitle={'QRCode Expired'}
      errorDesc={'Click to refresh.'}
      onRefresh={onRefresh}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
