import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react';
import {
  ChainWalletBase,
  ModalVersion,
  WalletModalPropsV2,
} from '@cosmos-kit/core';
import React, { useMemo, useRef } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { SimpleConnectModal as ConnectModal } from './components';
import { defaultThemeWithoutCSSReset } from './theme';
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
      if (display === 'list') {
        setModalHead(listViewHead);
        setModalContent(listViewContent);
      } else {
        setModalHead(singleViewHead);
        setModalContent(singleViewContent);
      }
    }, [...singleViewDeps, ...listViewDeps, display]);

    return (
      <ChakraProvider
        theme={theme || defaultThemeWithoutCSSReset}
        resetCSS={true}
        colorModeManager={createLocalStorageManager('chakra-ui-color-mode')} // let modal get global color mode
      >
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
      </ChakraProvider>
    );
  };
};
