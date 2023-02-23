import {
  InstallWalletButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';
import React, { useCallback } from 'react';
import { GoDesktopDownload } from 'react-icons/go';

export const NotExistView = ({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps) => {
  const {
    walletInfo: { prettyName, logo },
    downloadInfo,
  } = wallet;

  const onInstall = useCallback(() => {
    window.open(downloadInfo?.link, '_blank');
  }, [downloadInfo]);

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
      status={LogoStatus.Error}
      logo={logo}
      contentHeader={`${prettyName} Not Installed`}
      contentDesc={
        onInstall
          ? `If ${prettyName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instruction.`
          : `Download link not provided. Try searching it or consulting the developer team.`
      }
      bottomButton={
        <InstallWalletButton
          icon={downloadInfo?.icon || GoDesktopDownload}
          buttonText={`Install ${prettyName}`}
          onClick={onInstall}
          disabled={!downloadInfo?.link}
        />
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
