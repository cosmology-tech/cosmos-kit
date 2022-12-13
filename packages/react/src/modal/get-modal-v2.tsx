import {
  ChakraProvider,
  createLocalStorageManager,
  useColorMode,
} from '@chakra-ui/react';
import {
  ChainWalletBase,
  ModalVersion,
  WalletModalPropsV2,
} from '@cosmos-kit/core';
import React, { useMemo, useRef } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { SimpleConnectModal as ConnectModal } from './components';
import { noCssResetTheme } from './theme';
import { DisplayType } from './types';
import { getSingleWalletView, getWalletListView } from './utils-v2';

export const getModalV2 = (version: ModalVersion) => {
  return ({ isOpen, setOpen, walletRepo, theme }: WalletModalPropsV2) => {
    const initialFocus = useRef();
    const [display, setDisplay] = useState<DisplayType>('list');
    const [qrCodeWallet, setQRCodeWallet] = useState<
      ChainWalletBase | undefined
    >();
    const [modalHead, setModalHead] = useState<ReactNode>();
    const [modalContent, setModalContent] = useState<ReactNode>();
    const [colorMode, setColorMode] = useState<string | null>('light');
    const { colorMode: _colorMode } = useColorMode();

    const wallets = walletRepo?.wallets;
    const current = walletRepo?.current;

    const singleViewDeps = [
      current,
      current?.walletStatus,
      current?.qrUrl,
      qrCodeWallet?.qrUrl,
      display,
    ];
    const listViewDeps = [wallets];

    const [singleViewHead, singleViewContent] = useMemo(
      () =>
        getSingleWalletView(
          version,
          current,
          qrCodeWallet,
          setOpen,
          setDisplay,
          setQRCodeWallet
        ),
      singleViewDeps
    );

    const [listViewHead, listViewContent] = useMemo(
      () =>
        getWalletListView(
          version,
          current,
          wallets,
          setOpen,
          setDisplay,
          setQRCodeWallet,
          initialFocus
        ),
      listViewDeps
    );

    useEffect(() => {
      if (
        display === 'list' ||
        !current ||
        (current && current.walletStatus === 'Disconnected')
      ) {
        setModalHead(listViewHead);
        setModalContent(listViewContent);
      } else {
        setModalHead(singleViewHead);
        setModalContent(singleViewContent);
      }
    }, [...singleViewDeps, ...listViewDeps, display]);

    useEffect(() => {
      setColorMode(window.localStorage.getItem('chakra-ui-color-mode'));
    }, [_colorMode]);

    const modal = (
      <ConnectModal
        modalIsOpen={isOpen}
        modalOnClose={() => {
          if (!current || current.walletStatus === 'Disconnected') {
            setDisplay('list');
          } else {
            setDisplay('single');
          }
          setQRCodeWallet(void 0);
          setOpen(false);
        }}
        modalHead={modalHead}
        modalContent={modalContent}
        initialRef={initialFocus}
      />
    );

    if (colorMode) {
      return modal;
    }

    return (
      <ChakraProvider
        theme={theme || noCssResetTheme}
        resetCSS={true}
        colorModeManager={createLocalStorageManager('chakra-ui-color-mode')} // let modal get global color mode
      >
        {modal}
      </ChakraProvider>
    );
  };
};
