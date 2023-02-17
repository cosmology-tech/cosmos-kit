import {
  SimpleModalHead,
  QRCode,
  SimpleModalView,
  QRCodeStatus,
} from '@cosmology-ui/react';
import React from 'react';

export const ErrorQRCode = ({
  onClose,
  onReturn,
  onRefresh,
  name,
  message,
}: {
  onClose: () => void;
  onReturn: () => void;
  onRefresh: () => void;
  name: string;
  message: string;
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
      link=""
      status={QRCodeStatus.Error}
      errorTitle={'QRCode Error'}
      errorDesc={message}
      onRefresh={onRefresh}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
