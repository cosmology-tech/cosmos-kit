import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react';
import { ModalVersion, WalletModalProps } from '@cosmos-kit/core';
import React, { useRef } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { useWallet } from '../hooks';
import { SimpleConnectModal as ConnectModal } from './components';
import { defaultThemeWithoutCSSReset } from './theme';
import { getModalDetails } from './utils';

export const getModal = (version: ModalVersion) => {
  return ({ isOpen, setOpen }: WalletModalProps) => {
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
      const [_modalHead, _modalContent] = getModalDetails(
        walletManager,
        modalIsReset,
        resetModal,
        handleClose,
        initialFocus,
        version
      );

      setModalHead(_modalHead);
      setModalContent(_modalContent);
      if (!isOpen) {
        resetModal(false);
      }
    }, [walletStatus, modalIsReset, isOpen, currentWallet?.qrUrl]);

    return (
      <ChakraProvider
        theme={defaultThemeWithoutCSSReset}
        resetCSS={true}
        colorModeManager={createLocalStorageManager('chakra-ui-color-mode')} // let modal get global color mode
      >
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
};
