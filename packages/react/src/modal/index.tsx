import { WalletModalProps } from '@cosmos-kit/core';
import Bowser from 'bowser';
import React from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { useCosmos } from '../hooks';
import { ConnectModal } from './components/ConnectModal';
import { UserDeviceInfoType, WalletRecordType } from './types';
import { getModalContent } from './utils/modal-content';
import { getModalHead } from './utils/modal-head';

export const DefaultModal = ({ isOpen, setOpen }: WalletModalProps) => {
  const cosmosManager = useCosmos();
  const [modalHead, setModalHead] = useState<ReactNode>();
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [userBrowserInfo, setUserBrowserInfo] = useState<
    UserDeviceInfoType | undefined
  >();
  const [modalReset, setModalReset] = useState(false);

  const walletsData: WalletRecordType[] = cosmosManager.wallets.map(
    ({ walletInfo }) => {
      const { name, logo, prettyName, isQRCode, downloads } = walletInfo;
      return {
        id: name,
        logo,
        walletName: prettyName,
        walletType: isQRCode ? 'qrcode' : 'extension',
        extensionLink: { ...downloads, websiteDownload: downloads?.default },
        websiteDownload: downloads?.default,
        qrCodeLink: cosmosManager.currentWallet?.qrUri,
      };
    }
  );

  function handleClose() {
    setOpen(false);
    switch (cosmosManager.walletStatus) {
      case 'Connecting':
        cosmosManager.disconnect();
        break;
      case 'Disconnected':
        cosmosManager.setCurrentWallet(undefined);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setUserBrowserInfo({
      browser: Bowser.getParser(window.navigator.userAgent).getBrowserName(
        true
      ),
      device: Bowser.getParser(window.navigator.userAgent).getPlatform().type,
      os: Bowser.getParser(window.navigator.userAgent).getOSName(true),
    });
  }, []);

  useEffect(() => {
    const currentWalletData = walletsData.find(
      (data) => data.id === cosmosManager.currentWalletName
    );
    setModalHead(
      getModalHead(
        cosmosManager,
        currentWalletData,
        handleClose,
        modalReset,
        setModalReset
      )
    );
    setModalContent(
      getModalContent(
        cosmosManager,
        currentWalletData,
        userBrowserInfo,
        walletsData,
        modalReset,
        setModalReset
      )
    );
    if (!isOpen) {
      setModalReset(false);
    }
  }, [
    cosmosManager.walletStatus,
    cosmosManager.currentChainName,
    cosmosManager.currentWalletName,
    modalReset,
    isOpen,
    cosmosManager.currentWallet?.qrUri,
  ]);

  useEffect(() => {
    const appUrl = cosmosManager.currentWallet?.appUrl;
    if (appUrl) {
      window.location.href = appUrl;
    }
  }, [cosmosManager.currentWallet?.appUrl]);

  return (
    <ConnectModal
      modalIsOpen={isOpen}
      modalOnClose={handleClose}
      walletsData={walletsData}
      modalHead={modalHead}
      modalContent={modalContent}
    />
  );
};
