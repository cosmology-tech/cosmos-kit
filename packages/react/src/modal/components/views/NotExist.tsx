import {
  InstallWalletButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView,
} from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';
import React, { useCallback, useMemo } from 'react';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';
import { FaAndroid } from 'react-icons/fa';
import { RiAppStoreFill } from 'react-icons/ri';
import { GrFirefox } from 'react-icons/gr';

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

  const icon = useMemo(() => {
    if (downloadInfo?.browser === 'chrome') return RiChromeFill;
    if (downloadInfo?.browser === 'firefox') return GrFirefox;
    if (downloadInfo?.os === 'android') return FaAndroid;
    if (downloadInfo?.os === 'ios') return RiAppStoreFill;
    return GoDesktopDownload;
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
          icon={icon}
          buttonText={`Install ${prettyName}`}
          onClick={onInstall}
          disabled={!downloadInfo?.link}
        />
      }
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};
