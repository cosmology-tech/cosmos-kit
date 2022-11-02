/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletModalProps } from '@cosmos-kit/core';
import Bowser from 'bowser';
import React from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { useWallet } from '../hooks';
import { SimpleConnectModal as ConnectModal } from './components';
import { UserDeviceInfoType } from './components/types';
import { getModal } from './utils/get-modal';

export const DefaultModal = ({ isOpen, setOpen }: WalletModalProps) => {
  const walletManager = useWallet();
  const [modalHead, setModalHead] = useState<ReactNode>();
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [browser, setBrowser] = useState<UserDeviceInfoType | undefined>();
  const [modalIsReset, resetModal] = useState(false);

  function handleClose() {
    setOpen(false);
    switch (walletManager.walletStatus) {
      case 'Connecting':
        walletManager.disconnect();
        return;
      case 'Disconnected':
        walletManager.setCurrentWallet(undefined);
        return;
      default:
        return;
    }
  }

  useEffect(() => {
    const parser = Bowser.getParser(window.navigator.userAgent);
    setBrowser({
      browser: parser.getBrowserName(true),
      device: parser.getPlatform().type,
      os: parser.getOSName(true),
    });
  }, []);

  useEffect(() => {
    const [modalHead, modalContent] = getModal(
      browser,
      walletManager,
      modalIsReset,
      resetModal,
      handleClose
    );

    setModalHead(modalHead);
    setModalContent(modalContent);
    if (!isOpen) {
      resetModal(false);
    }
  }, [
    walletManager.walletStatus,
    walletManager.currentChainName,
    walletManager.currentWalletName,
    modalIsReset,
    isOpen,
    (walletManager.currentWallet as any)?.qrUri,
  ]);

  useEffect(() => {
    const appUrl = (walletManager.currentWallet as any)?.appUrl;
    if (appUrl) {
      window.location.href = appUrl;
    }
  }, [(walletManager.currentWallet as any)?.appUrl]);

  return (
    <ConnectModal
      modalIsOpen={isOpen}
      modalOnClose={handleClose}
      modalHead={modalHead}
      modalContent={modalContent}
    />
  );
};
