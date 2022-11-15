/* eslint-disable no-console */
import { ColorModeProvider } from '@chakra-ui/color-mode';
import { ColorMode, ThemeProvider } from '@chakra-ui/react';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { useRef } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { useWallet } from '../hooks';
import { SimpleConnectModal as ConnectModal } from './components';
import { getModal } from './get-modal';
import { defaultTheme } from './theme';

export const DefaultModal = ({ isOpen, setOpen }: WalletModalProps) => {
  const walletManager = useWallet();
  const { walletStatus, currentWallet, disconnect, setCurrentWallet } =
    walletManager;
  const [modalHead, setModalHead] = useState<ReactNode>();
  const [modalContent, setModalContent] = useState<ReactNode>();
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
    const [modalHead, modalContent] = getModal(
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

  const [mode, setMode] = useState<ColorMode>('light');

  useEffect(() => {
    setMode(window.localStorage.getItem('chakra-ui-color-mode') as ColorMode);
  }, [isOpen]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <ColorModeProvider
        value={mode}
        options={{
          useSystemColorMode: false,
          initialColorMode: 'light',
        }}
      >
        <ConnectModal
          modalIsOpen={isOpen}
          modalOnClose={handleClose}
          modalHead={modalHead}
          modalContent={modalContent}
          initialRef={initialFocus}
        />
      </ColorModeProvider>
    </ThemeProvider>
  );
};
