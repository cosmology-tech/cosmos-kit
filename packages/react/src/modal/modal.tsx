import {
  ModalOptions,
  ModalView,
  State,
  WalletListViewProps,
  WalletModalProps,
  WalletStatus,
  WalletViewProps,
} from '@cosmos-kit/core';
import {
  ConnectModal,
  ThemeProvider,
  ThemeProviderProps,
} from '@interchain-ui/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  defaultModalViews,
  ModalViewImpl,
  WalletListImplGetter,
  WalletViewImplGetter,
} from './components/views';
import { useSelectedWalletRepoContext } from '../context';

export type ModalCustomizationProps = {
  modalContainerClassName?: string;
  modalContentClassName?: string;
  modalChildrenClassName?: string;
  modalContentStyles?: React.CSSProperties;
};

export type ThemeCustomizationProps = ModalCustomizationProps &
  Pick<
    ThemeProviderProps,
    'defaultTheme' | 'overrides' | 'themeDefs' | 'customTheme'
  >;

export type WalletModalComponentProps = WalletModalProps &
  ThemeCustomizationProps & {
    modalViews: typeof defaultModalViews;
    modalOptions?: ModalOptions;
    includeAllWalletsOnMobile?: boolean;
  };

export function WalletModal({
  isOpen,
  setOpen,
  walletRepo,
  modalViews,
  modalOptions,
  includeAllWalletsOnMobile,
  overrides,
  themeDefs,
  customTheme,
  defaultTheme,
  // ==== Custom modal styles
  modalContainerClassName,
  modalContentClassName,
  modalChildrenClassName,
  modalContentStyles,
}: WalletModalComponentProps) {
  const initialFocus = useRef();
  const [currentView, setCurrentView] = useState<ModalView>(
    ModalView.WalletList
  );
  const [qrState, setQRState] = useState<State>(State.Init); // state of QRCode
  const [qrMsg, setQRMsg] = useState<string>(''); //   message of QRCode error

  const disconnectOptions = {
    walletconnect: {
      removeAllPairings: modalOptions?.mobile?.displayQRCodeEveryTime,
    },
  };
  walletRepo?.setCallbackOptions({
    beforeConnect: { disconnect: disconnectOptions },
  });

  const { selectedWalletRepoName } = useSelectedWalletRepoContext()
  const current = walletRepo?.wallets.find(w => w.walletName === selectedWalletRepoName);

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
        case WalletStatus.NotExist: {
          setCurrentView((prev) =>
            prev === ModalView.Connected
              ? ModalView.WalletList
              : ModalView.NotExist
          );
          break;
        }
        case WalletStatus.Disconnected:
          setCurrentView(ModalView.WalletList);
          break;
        default:
          setCurrentView(ModalView.WalletList);
          break;
      }
    }
  }, [qrState, walletStatus, qrMsg, message]);

  useEffect(() => {
    if (!isOpen) return;
    if (walletStatus === 'Connected') {
      setCurrentView(ModalView.Connected);
    } else {
      setCurrentView(ModalView.WalletList);
    }
  }, [isOpen]);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    if (walletStatus === 'Connecting') {
      current?.disconnect(false, disconnectOptions);
    }
  }, [setOpen, walletStatus, current]);

  const onReturn = useCallback(() => {
    setCurrentView(ModalView.WalletList);
  }, [setCurrentView]);

  const wallets = useMemo(
    () =>
      !includeAllWalletsOnMobile
        ? walletRepo?.platformEnabledWallets
        : walletRepo?.wallets,
    [walletRepo, includeAllWalletsOnMobile]
  );

  const modalView: ModalViewImpl = useMemo(() => {
    switch (currentView) {
      case ModalView.WalletList: {
        const getImplementation = modalViews[
          `${currentView}`
        ] as WalletListImplGetter;

        return getImplementation({
          onClose: onCloseModal,
          wallets: wallets || [],
          initialFocus: initialFocus,
        } as WalletListViewProps);
      }
      default: {
        const getImplementation = modalViews[
          `${currentView}`
        ] as WalletViewImplGetter;

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
          options: modalOptions,
        } as WalletViewProps);
      }
    }
  }, [
    currentView,
    onReturn,
    onCloseModal,
    current,
    qrState,
    walletStatus,
    walletRepo,
    wallets,
    message,
    initialFocus,
    qrMsg,
  ]);

  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      overrides={overrides}
      themeDefs={themeDefs}
      customTheme={customTheme}
    >
      <ConnectModal
        isOpen={isOpen}
        header={modalView.head}
        onClose={onCloseModal}
        modalContainerClassName={modalContainerClassName}
        modalContentClassName={modalContentClassName}
        modalChildrenClassName={modalChildrenClassName}
        modalContentStyles={modalContentStyles}
      >
        {modalView.content}
      </ConnectModal>
    </ThemeProvider>
  );
}

export function DefaultModal({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) {
  return (
    <WalletModal
      isOpen={isOpen}
      setOpen={setOpen}
      walletRepo={walletRepo}
      modalViews={defaultModalViews}
    />
  );
}
