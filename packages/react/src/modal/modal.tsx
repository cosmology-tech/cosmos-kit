import { SimpleConnectModal } from '@cosmology-ui/react';
import {
  ModalView,
  ModalViews,
  State,
  WalletListViewProps,
  WalletModalProps,
  WalletStatus,
  WalletViewProps,
} from '@cosmos-kit/core';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import { WrapperWithProvidedTheme } from './components';
import { defaultModalViews } from './components/views';

export const DefaultModal = ({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) => {
  return (
    <WrapperWithProvidedTheme>
      <WalletModal
        isOpen={isOpen}
        setOpen={setOpen}
        walletRepo={walletRepo}
        modalViews={defaultModalViews}
      />
    </WrapperWithProvidedTheme>
  );
};

export const WalletModal = ({
  isOpen,
  setOpen,
  walletRepo,
  modalViews,
}: WalletModalProps & { modalViews: ModalViews }) => {
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
  }, [isOpen, qrState, walletStatus, qrMsg]);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    if (walletStatus === 'Connecting') {
      current?.disconnect();
    }
  }, [setOpen, walletStatus, current]);

  const onReturn = useCallback(() => {
    setCurrentView(ModalView.WalletList);
  }, [setCurrentView]);

  const modalView = useMemo(() => {
    let ViewComponent;
    switch (currentView) {
      case ModalView.WalletList:
        ViewComponent = modalViews[`${currentView}`] as (
          props: WalletListViewProps
        ) => JSX.Element;
        return (
          <ViewComponent
            onClose={onCloseModal}
            wallets={walletRepo?.wallets || []}
            initialFocus={initialFocus}
          />
        );
      default:
        if (!current) return <div />;

        ViewComponent = modalViews[`${currentView}`] as (
          props: WalletViewProps
        ) => JSX.Element;
        return (
          <ViewComponent
            onClose={onCloseModal}
            onReturn={onReturn}
            wallet={current}
          />
        );
    }
  }, [
    currentView,
    onReturn,
    onCloseModal,
    current,
    qrState,
    walletStatus,
    walletRepo,
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
