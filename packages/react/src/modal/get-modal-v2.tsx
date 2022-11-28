import { ColorMode, useColorMode } from '@chakra-ui/react';
import { ModalVersion, WalletModalPropsV2 } from '@cosmos-kit/core';
import React, { useMemo, useRef } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { SimpleConnectModal as ConnectModal } from './components';
import { DisplayType } from './types';
import {
  getSingleWalletView,
  getWalletListView,
  StyleProvider,
} from './utils-v2';

export const getModalV2 = (version: ModalVersion) => {
  return ({ isOpen, setOpen, walletRepo }: WalletModalPropsV2) => {
    const initialFocus = useRef();
    const [display, setDisplay] = useState<DisplayType | undefined>();
    const [modalHead, setModalHead] = useState<ReactNode>();
    const [modalContent, setModalContent] = useState<ReactNode>();

    const wallets = walletRepo?.wallets;
    const current = walletRepo?.current;

    const singleViewDeps = [current, current?.walletStatus, current?.qrUrl];
    const listViewDeps = [wallets];

    const [singleViewHead, singleViewContent] = useMemo(
      () => getSingleWalletView(version, current, setOpen, setDisplay),
      singleViewDeps
    );

    const [listViewHead, listViewContent] = useMemo(
      () =>
        getWalletListView(version, wallets, setOpen, setDisplay, initialFocus),
      listViewDeps
    );

    useEffect(() => {
      if (!current || display === 'list') {
        setModalHead(listViewHead);
        setModalContent(listViewContent);
      } else {
        setModalHead(singleViewHead);
        setModalContent(singleViewContent);
      }
    }, [...singleViewDeps, ...listViewDeps, display]);

    const [mode, setMode] = useState<ColorMode>('light');

    useEffect(() => {
      setMode(window.localStorage.getItem('chakra-ui-color-mode') as ColorMode);
    }, [isOpen]);

    const { colorMode } = useColorMode();
    const modal = (
      <ConnectModal
        modalIsOpen={isOpen}
        modalOnClose={() => setOpen(false)}
        modalHead={modalHead}
        modalContent={modalContent}
        initialRef={initialFocus}
      />
    );

    if (colorMode) {
      return modal;
    }

    return <StyleProvider colorMode={mode}>{modal}</StyleProvider>;
  };
};
