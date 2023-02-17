import { AssetList, Chain } from '@chain-registry/types';
import {
  Data,
  EndpointOptions,
  Logger,
  LogLevel,
  MainWalletBase,
  NameServiceName,
  SessionOptions,
  SignerOptions,
  State,
  WalletConnectOptions,
  WalletManager,
  WalletModalProps,
  WalletRepo,
} from '@cosmos-kit/core';
import { ThemeContext } from '@emotion/react';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getWalletModal, noCssResetTheme } from '.';

export const walletContext = createContext<{
  walletManager: WalletManager;
} | null>(null);

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  modalTheme,
  wrappedWithChakra = false,
  defaultNameService = 'icns',
  walletConnectOptions,
  signerOptions,
  endpointOptions,
  sessionOptions,
  logLevel = 'WARN',
  children,
}: {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: MainWalletBase[];
  walletModal?: (props: WalletModalProps) => JSX.Element;
  modalTheme?: Record<string, any>;
  wrappedWithChakra?: boolean;
  defaultNameService?: NameServiceName;
  walletConnectOptions?: WalletConnectOptions; // SignClientOptions is required if using wallet connect v2
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  sessionOptions?: SessionOptions;
  logLevel?: LogLevel;
  children: ReactNode;
}) => {
  const logger = useMemo(() => new Logger(console, logLevel), []);
  if (wrappedWithChakra && modalTheme) {
    logger.warn(
      'Your are sugguesting there already been a Chakra Theme active in higher level (with `wrappedWithChakra` is true). `modalTheme` will not work in this case.'
    );
  }
  const walletManager = useMemo(
    () =>
      new WalletManager(
        chains,
        assetLists,
        wallets,
        logger,
        defaultNameService,
        walletConnectOptions,
        signerOptions,
        endpointOptions,
        sessionOptions
      ),
    []
  );

  const [isViewOpen, setViewOpen] = useState<boolean>(false);
  const [viewWalletRepo, setViewWalletRepo] = useState<
    WalletRepo | undefined
  >();

  const [, setData] = useState<Data>();
  const [, setState] = useState<State>(State.Init);
  const [, setMsg] = useState<string | undefined>();

  walletManager.setActions({
    viewOpen: setViewOpen,
    viewWalletRepo: setViewWalletRepo,
    data: setData,
    state: setState,
    message: setMsg,
  });

  walletManager.walletRepos.forEach((wr) => {
    wr.setActions({
      viewOpen: setViewOpen,
      viewWalletRepo: setViewWalletRepo,
    });
    wr.wallets.forEach((w) => {
      w.setActions({
        data: setData,
        state: setState,
        message: setMsg,
      });
    });
  });

  const outerTheme = useContext(ThemeContext);

  const Modal = useMemo(
    () =>
      walletModal ||
      getWalletModal(
        wrappedWithChakra ? outerTheme : modalTheme || noCssResetTheme
      ),
    []
  );

  useEffect(() => {
    walletManager.onMounted();
    return () => {
      walletManager.onUnmounted();
    };
  }, []);

  return (
    <walletContext.Provider
      value={{
        walletManager,
      }}
    >
      <Modal
        isOpen={isViewOpen}
        setOpen={setViewOpen}
        walletRepo={viewWalletRepo}
      />
      {children}
    </walletContext.Provider>
  );
};
