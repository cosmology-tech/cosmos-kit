import { ChakraProvider } from '@chakra-ui/react';
import { WalletModalProps } from '@cosmos-kit/core';
import Bowser from 'bowser';
import React, { useRef } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { useWallet } from '../hooks';
import { SimpleConnectModal as ConnectModal } from './components';
import { UserDeviceInfoType } from './components/types';
import { getModal } from './get-modal';
import { defaultTheme } from './theme';

export const DefaultModal = ({ isOpen, setOpen }: WalletModalProps) => {
  const walletManager = useWallet();
  const { walletStatus, currentWallet, disconnect, setCurrentWallet } =
    walletManager;
  const [modalHead, setModalHead] = useState<ReactNode>();
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [userAgent, setUserAgent] = useState<UserDeviceInfoType | undefined>();
  const [modalIsReset, resetModal] = useState(false);
  const initialFocus = useRef();

  function handleClose() {
    setOpen(false);
    if (walletManager.isWalletConnecting) {
      disconnect();
    } else if (walletManager.isWalletDisconnected) {
      setCurrentWallet(undefined);
    }
  }

  useEffect(() => {
    const parser = Bowser.getParser(window.navigator.userAgent);
    setUserAgent({
      browser: parser.getBrowserName(true),
      device: parser.getPlatform().type || 'desktop',
      os: parser.getOSName(true),
    });
  }, []);

  useEffect(() => {
    const [modalHead, modalContent] = getModal(
      userAgent,
      walletManager,
      modalIsReset,
      resetModal,
      handleClose,
      initialFocus
    );

    setModalHead(modalHead);
    setModalContent(modalContent);
    if (!isOpen) {
      resetModal(false);
    }
  }, [walletStatus, modalIsReset, isOpen, currentWallet?.qrUrl]);

  useEffect(() => {
    const appUrl = currentWallet?.appUrl;
    if (appUrl) {
      window.location.href = appUrl;
    }
  }, [currentWallet?.appUrl]);

  return (
    <ChakraProvider theme={defaultTheme}>
      <ConnectModal
        modalIsOpen={isOpen}
        modalOnClose={handleClose}
        modalHead={modalHead}
        modalContent={modalContent}
        initialRef={initialFocus}
      />
    </ChakraProvider>
  );
};
