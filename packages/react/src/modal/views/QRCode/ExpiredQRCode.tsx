import { Square } from '@chakra-ui/react';
import {
  SimpleModalHead,
  QRCode as SimpleQRCode,
  SimpleModalView,
} from '@cosmology-ui/react';
import React from 'react';

export const ExpiredQRCode = ({
  onClose,
  onReturn,
  onRefresh,
  name,
}: {
  onClose: () => void;
  onReturn: () => void;
  onRefresh: () => void;
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
    // <SimpleQRCode
    //   link={''}
    //   description={`QRCode expired. Click to refresh.`}
    //   loading={false}
    // />
    <Square minW={'100px'} onClick={onRefresh}>
      QRCode expired. Click to refresh.
    </Square>
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
