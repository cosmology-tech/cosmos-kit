import { SimpleConnectModal, ThemeProvider } from '@cosmology-ui/react';
import {
  ExpireError,
  State,
  WalletModalProps,
  WalletStatus,
} from '@cosmos-kit/core';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
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
  LoadingQRCode,
  ExpiredQRCode,
  ErrorQRCode,
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
  const [qrState, setQRState] = useState<State>(State.Init); // state of QRCode
  const [qrMsg, setQRMsg] = useState<string>(''); // message of QRCode error

  const current = walletRepo?.current;
  current?.client?.setActions?.({
    qrUrl: {
      state: setQRState,
      message: setQRMsg,
    },
  });
  const walletInfo = current?.walletInfo;
  const walletStatus = current?.walletStatus;

  useEffect(() => {
    if (isOpen) {
      switch (walletStatus) {
        case WalletStatus.Connecting:
          switch (qrState) {
            case State.Pending:
              setCurrentView(ModalView.LoadingQRCode);
              break;
            case State.Done:
              setCurrentView(ModalView.QRCode);
              break;
            case State.Error:
              if (qrMsg === ExpireError.message) {
                setCurrentView(ModalView.ExpiredQRCode);
              } else {
                setCurrentView(ModalView.ErrorQRCode);
              }
              break;
            default:
              setCurrentView(ModalView.Connecting);
              break;
          }
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
        case WalletStatus.Disconnected:
          setCurrentView(ModalView.WalletList);
          break;
        default:
          setCurrentView(ModalView.WalletList);
          break;
      }
    }
  }, [isOpen, qrState, walletStatus]);

  const onWalletClicked = useCallback(
    (name: string) => {
      walletRepo?.connect(name, true);
    },
    [walletRepo]
  );

  const onReconnect = useCallback(() => {
    if (walletInfo?.name) {
      walletRepo?.connect(walletInfo.name!, false);
    }
  }, [walletRepo, walletInfo]);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    if (walletStatus === 'Connecting') {
      current?.disconnect();
    }
  }, [setOpen]);

  const onReturn = useCallback(() => {
    setCurrentView(ModalView.WalletList);
  }, [setCurrentView]);

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
            onReturn={onReturn}
            onDisconnect={() => current?.disconnect(void 0, true)}
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
            onReturn={onReturn}
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
            onReturn={onReturn}
            qrUrl={current?.client?.qrUrl.data}
            name={current?.walletInfo.prettyName}
          />
        );
      case ModalView.LoadingQRCode:
        return (
          <LoadingQRCode
            onClose={onCloseModal}
            onReturn={onReturn}
            name={current?.walletInfo.prettyName}
          />
        );
      case ModalView.ExpiredQRCode:
        return (
          <ExpiredQRCode
            onClose={onCloseModal}
            onReturn={onReturn}
            onRefresh={onReconnect}
            name={current?.walletInfo.prettyName}
          />
        );
      case ModalView.ErrorQRCode:
        return (
          <ErrorQRCode
            onClose={onCloseModal}
            onReturn={onReturn}
            onRefresh={onReconnect}
            name={current?.walletInfo.prettyName}
            message={qrMsg}
          />
        );
      case ModalView.Error:
        return (
          <Error
            onClose={onCloseModal}
            onReturn={onReturn}
            logo={walletInfo!.logo}
            onChangeWallet={onReturn}
            name={walletInfo!.prettyName}
            message={current.message!}
          />
        );
      case ModalView.Rejected:
        return (
          <Rejected
            onClose={onCloseModal}
            onReturn={onReturn}
            logo={walletInfo!.logo}
            onReconnect={onReconnect}
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
            onReturn={onReturn}
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
  }, [
    currentView,
    onCloseModal,
    onWalletClicked,
    walletInfo,
    current,
    qrState,
  ]);

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
