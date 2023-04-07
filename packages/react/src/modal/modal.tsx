import { SimpleConnectModal } from '@cosmology-ui/react';
import {
  ChainWallet,
  DownloadInfo,
  getGlobalStatusAndMessage,
  ModalView,
  ModalViews,
  State,
  Wallet,
  WalletClient,
  WalletModalProps,
  WalletRepo,
  WalletStatus,
} from '@cosmos-kit/core';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import { ChakraProviderWithGivenTheme } from './components';
import { defaultModalViews } from './config';

export const DefaultModal = ({
  isOpen,
  setOpen,
  walletRepos,
}: WalletModalProps) => {
  return (
    <ChakraProviderWithGivenTheme>
      {walletRepos.length !== 0 && (
        <WalletModal
          isOpen={isOpen}
          setOpen={setOpen}
          walletRepos={walletRepos}
          modalViews={defaultModalViews}
        />
      )}
    </ChakraProviderWithGivenTheme>
  );
};

export const WalletModal = ({
  isOpen,
  setOpen,
  walletRepos,
  modalViews,
  includeAllWalletsOnMobile,
}: WalletModalProps & {
  modalViews: ModalViews;
  includeAllWalletsOnMobile?: boolean;
}) => {
  const initialFocus = useRef();
  const [currentView, setCurrentView] = useState<ModalView>(
    ModalView.WalletList
  );
  const [qrState, setQRState] = useState<State>(State.Init); // state of QRCode
  const [qrMsg, setQRMsg] = useState<string>(''); // message of QRCode error

  const {
    repos,
    currents,
    walletStatus,
    message,
    walletInfo,
    downloadInfo,
    walletClient,
  }: {
    repos: WalletRepo[];
    currents: ChainWallet[];
    walletStatus: WalletStatus;
    message: string | undefined;
    walletInfo: Wallet | undefined;
    downloadInfo: DownloadInfo | undefined;
    walletClient: WalletClient | undefined;
  } = useMemo(() => {
    const currents = walletRepos
      .map((repo) => {
        const current = repo.current;
        (current?.client as any)?.setActions?.({
          qrUrl: {
            state: setQRState,
            message: setQRMsg,
          },
        });
        return current;
      })
      .filter((w) => Boolean(w));
    let [walletStatus, message] = [WalletStatus.Disconnected, void 0];
    if (currents.length !== 0) {
      [walletStatus, message] = getGlobalStatusAndMessage(currents);
    }
    return {
      repos,
      currents,
      walletStatus,
      message,
      walletInfo: currents[0]?.walletInfo,
      downloadInfo: currents[0]?.downloadInfo,
      walletClient: currents[0]?.client,
    };
  }, [walletRepos]);

  useEffect(() => {
    if (isOpen) {
      switch (walletStatus) {
        case WalletStatus.Connecting:
          if (qrState === State.Init) {
            setCurrentView(ModalView.Connecting);
          } else {
            setCurrentView(ModalView.QRCode);
          }
          break;
        case WalletStatus.Connected:
          setCurrentView(ModalView.Connected);
          break;
        case WalletStatus.Error:
          if (qrState === State.Init) {
            setCurrentView(ModalView.Error);
          } else {
            setCurrentView(ModalView.QRCode);
          }
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
  }, [isOpen, qrState, walletStatus, qrMsg, message]);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    if (walletStatus === 'Connecting') {
      currents[0]?.disconnect();
    }
  }, [setOpen, walletStatus, currents]);

  const onReturn = useCallback(() => {
    setCurrentView(ModalView.WalletList);
  }, [setCurrentView]);

  const modalView = useMemo(() => {
    switch (currentView) {
      case ModalView.WalletList:
        const WalletList = modalViews['WalletList'];
        return (
          <WalletList
            onClose={onCloseModal}
            repos={repos}
            includeAllWalletsOnMobile={includeAllWalletsOnMobile}
            initialFocus={initialFocus}
          />
        );
      case ModalView.Connecting:
        const Connecting = modalViews['Connecting'];
        return (
          <Connecting
            onClose={onCloseModal}
            onReturn={onReturn}
            walletInfo={walletInfo}
            message={message}
          />
        );
      case ModalView.Connected:
        const Connected = modalViews['Connected'];
        return (
          <Connected
            onClose={onCloseModal}
            onReturn={onReturn}
            walletInfo={walletInfo}
            wallets={currents}
            message={message}
          />
        );
      case ModalView.Error:
        const _Error = modalViews['Error'];
        return (
          <_Error
            onClose={onCloseModal}
            onReturn={onReturn}
            walletInfo={walletInfo}
            message={message}
          />
        );
      case ModalView.NotExist:
        const NotExist = modalViews['NotExist'];
        return (
          <NotExist
            onClose={onCloseModal}
            onReturn={onReturn}
            walletInfo={walletInfo}
            downloadInfo={downloadInfo}
            message={message}
          />
        );
      case ModalView.Rejected:
        const Rejected = modalViews['Rejected'];
        return (
          <Rejected
            onClose={onCloseModal}
            onReturn={onReturn}
            walletInfo={walletInfo}
            wallets={currents}
            message={message}
          />
        );
      case ModalView.QRCode:
        const QRCode = modalViews['QRCode'];
        return (
          <QRCode
            onClose={onCloseModal}
            onReturn={onReturn}
            walletInfo={walletInfo}
            walletClient={walletClient}
            message={message}
          />
        );
      default:
        if (currents.length === 0) return <div />;
    }
  }, [
    currentView,
    onReturn,
    onCloseModal,
    currents,
    qrState,
    walletStatus,
    walletRepos,
    message,
    qrMsg,
  ]);

  return (
    <SimpleConnectModal
      modalOpen={isOpen}
      modalOnClose={onCloseModal}
      modalView={modalView}
      initialRef={initialFocus}
    />
  );
};
