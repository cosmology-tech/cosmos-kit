import {
  LogoStatus,
  SimpleConnectModal,
  SimpleDisplayModalContent,
  SimpleModalHead,
} from '@cosmology-ui/react';
import { useRef } from 'react';

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
    <SimpleDisplayModalContent
      status={LogoStatus.Loading}
      logo={logo}
      contentHeader={title}
      contentDesc={subtitle}
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
