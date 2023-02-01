import {
  SimpleConnectModal,
  SimpleModalHead,
  QRCode as SimpleQRCode,
} from '@cosmology-ui/react';
import { useRef } from 'react';

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
    <SimpleQRCode
      link={qrUrl || ''}
      description={`Open ${name} App to Scan`}
      loading={loading}
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
