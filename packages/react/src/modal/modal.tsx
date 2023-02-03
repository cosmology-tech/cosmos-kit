import {
  SimpleConnectModal,
  ThemeContext,
  ThemeProvider,
} from '@cosmology-ui/react';
import {
  ChainWalletBase,
  WalletModalProps,
  WalletStatus,
} from '@cosmos-kit/core';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import { noCssResetTheme } from './theme/config';
import { ChakraThemeWrapper } from './theme/wrapper';

import { ModalView } from './types';
import {
  Connected,
  Connecting,
  NotExist,
  QRCode,
  WalletList,
  Error,
  Rejected,
} from './views';

export const DefaultModal = ({
  isOpen,
  setOpen,
  walletRepo,
  theme,
}: WalletModalProps) => {
  const initialFocus = useRef();
  const [currentView, setCurrentView] = useState<ModalView>(
    ModalView.WalletList
  );
  const [qrWallet, setQRWallet] = useState<ChainWalletBase | undefined>();

  const current = walletRepo?.current;
  const walletInfo = current?.walletInfo;
  const status = current?.walletStatus || WalletStatus.Disconnected;
  const walletName = current?.walletName;

  useEffect(() => {
    if (isOpen) {
      switch (status) {
        case WalletStatus.Disconnected:
          setCurrentView(ModalView.WalletList);
          break;
        case WalletStatus.Connecting:
          setCurrentView(ModalView.Connecting);
          break;
        case WalletStatus.Connected:
          setCurrentView(ModalView.Connected);
          break;
        case WalletStatus.Error:
          setCurrentView(ModalView.Error);
          break;
        case WalletStatus.Rejected:
          setCurrentView(ModalView.Rejected);
          break;
        case WalletStatus.NotExist:
          setCurrentView(ModalView.NotExist);
          break;
      }
    }
  }, [isOpen, status, walletName]);

  const onWalletClicked = useCallback(
    (name: string) => {
      walletRepo?.connect(name);

      // 1ms timeout prevents modal from determining the view to show first
      setTimeout(() => {
        const wallet = walletRepo?.getWallet(name);
        if (wallet?.walletInfo.mode === 'wallet-connect' && !wallet.isMobile) {
          setCurrentView(ModalView.QRCode);
          setQRWallet(wallet);
        }
      }, 1);
    },
    [walletRepo]
  );

  const onCloseModal = useCallback(() => {
    setOpen(false);
    if (status === 'Connecting') {
      current?.disconnect();
    }
  }, [setOpen]);

  const modalView = useMemo(() => {
    switch (currentView) {
      case ModalView.WalletList:
        return (
          <WalletList
            onClose={onCloseModal}
            onWalletClicked={onWalletClicked}
            wallets={walletRepo?.wallets || []}
          />
        );
      case ModalView.Connected:
        return (
          <Connected
            onClose={onCloseModal}
            onReturn={() => setCurrentView(ModalView.WalletList)}
            onDisconnect={() => current?.disconnect()}
            name={walletInfo?.prettyName!}
            logo={walletInfo?.logo!}
            username={current?.username}
            address={current?.address}
          />
        );
      case ModalView.Connecting:
        let subtitle: string;
        if (walletInfo!.mode === 'wallet-connect') {
          subtitle = `Approve ${
            walletInfo!.prettyName
          } connection request on your mobile.`;
        } else {
          subtitle = `Open the ${
            walletInfo!.prettyName
          } browser extension to connect your wallet.`;
        }

        return (
          <Connecting
            onClose={onCloseModal}
            onReturn={() => setCurrentView(ModalView.WalletList)}
            name={walletInfo!.prettyName}
            logo={walletInfo!.logo}
            title="Requesting Connection"
            subtitle={subtitle}
          />
        );
      case ModalView.QRCode:
        return (
          <QRCode
            onClose={onCloseModal}
            onReturn={() => setCurrentView(ModalView.WalletList)}
            qrUrl={qrWallet?.qrUrl}
            name={qrWallet?.walletInfo.prettyName}
            loading={Boolean(qrWallet?.qrUrl)}
          />
        );
      case ModalView.Error:
        return (
          <Error
            onClose={onCloseModal}
            onReturn={() => setCurrentView(ModalView.WalletList)}
            logo={walletInfo!.logo}
            onChangeWallet={() => setCurrentView(ModalView.WalletList)}
            name={walletInfo!.prettyName}
            message={current.message!}
          />
        );
      case ModalView.Rejected:
        return (
          <Rejected
            onClose={onCloseModal}
            onReturn={() => setCurrentView(ModalView.WalletList)}
            logo={walletInfo!.logo}
            onReconnect={() => onWalletClicked(walletInfo?.name!)}
            name={walletInfo!.prettyName}
            message={
              current.rejectMessageTarget || 'Connection permission is denied.'
            }
          />
        );
      case ModalView.NotExist:
        const downloadInfo = current?.downloadInfo;
        return (
          <NotExist
            onClose={onCloseModal}
            onReturn={() => setCurrentView(ModalView.WalletList)}
            onInstall={
              downloadInfo?.link
                ? () => {
                    window.open(downloadInfo?.link, '_blank');
                  }
                : undefined
            }
            logo={walletInfo!.logo}
            name={walletInfo!.prettyName}
            buttonIcon={downloadInfo?.icon}
          />
        );
    }
  }, [currentView, onCloseModal, onWalletClicked, walletInfo, current]);

  return (
    <ThemeProvider>
      <ChakraThemeWrapper theme={theme || noCssResetTheme}>
        <SimpleConnectModal
          modalOpen={isOpen}
          modalOnClose={onCloseModal}
          modalView={modalView}
          initialRef={initialFocus}
        />
      </ChakraThemeWrapper>
    </ThemeProvider>
  );
};
