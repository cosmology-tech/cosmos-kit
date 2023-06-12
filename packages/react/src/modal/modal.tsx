import { ConnectModal } from '@cosmology-ui/react';
import {
  ModalView,
  State,
  WalletModalProps,
  WalletStatus,
} from '@cosmos-kit/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { defaultModalViews, ModalViewImpl } from './components/views';

export const DefaultModal = ({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) => {
  return (
    <WalletModal
      isOpen={isOpen}
      setOpen={setOpen}
      walletRepo={walletRepo}
      modalViews={defaultModalViews}
    />
  );
};

export const WalletModal = ({
  isOpen,
  setOpen,
  walletRepo,
  modalViews,
  includeAllWalletsOnMobile,
}: WalletModalProps & {
  modalViews: typeof defaultModalViews;
  includeAllWalletsOnMobile?: boolean;
}) => {
  const initialFocus = useRef();
  const [currentView, setCurrentView] = useState<ModalView>(
    ModalView.WalletList
  );
  const [qrState, setQRState] = useState<State>(State.Init); // state of QRCode
  const [qrMsg, setQRMsg] = useState<string>(''); // message of QRCode error

  const current = walletRepo?.current;
  (current?.client as any)?.setActions?.({
    qrUrl: {
      state: setQRState,
      message: setQRMsg,
    },
  });
  const walletStatus = current?.walletStatus;
  const message = current?.message;

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
      current?.disconnect();
    }
  }, [setOpen, walletStatus, current]);

  const onReturn = useCallback(() => {
    setCurrentView(ModalView.WalletList);
  }, [setCurrentView]);

  const wallets = useMemo(
    () =>
      walletRepo?.isMobile && !includeAllWalletsOnMobile
        ? walletRepo?.wallets.filter((w) => !w.walletInfo.mobileDisabled)
        : walletRepo?.wallets,
    [walletRepo.wallets, includeAllWalletsOnMobile]
  );

  const modalView: ModalViewImpl = useMemo(() => {
    const getImplementation = modalViews[`${currentView}`];

    switch (currentView) {
      case ModalView.WalletList:
        return getImplementation({
          onClose: onCloseModal,
          wallets: wallets || [],
          initialFocus: initialFocus,
        });
      default:
        if (!current) {
          return {
            head: null,
            content: null,
          };
        }
        return getImplementation({
          onClose: onCloseModal,
          onReturn: onReturn,
          wallet: current,
        });
    }
  }, [
    currentView,
    onReturn,
    onCloseModal,
    current,
    qrState,
    walletStatus,
    walletRepo,
    message,
    qrMsg,
  ]);

  return (
    <ConnectModal
      isOpen={isOpen}
      header={modalView.head}
      onClose={onCloseModal}
    >
      {modalView.content}
    </ConnectModal>
  );
};
