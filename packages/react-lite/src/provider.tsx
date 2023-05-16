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
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const walletContext = createContext<{
  walletManager: WalletManager;
  modalProvided: boolean;
} | null>(null);

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal: ProvidedWalletModal,
  throwErrors = false,
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
  throwErrors?: boolean;
  defaultNameService?: NameServiceName;
  walletConnectOptions?: WalletConnectOptions; // SignClientOptions is required if using wallet connect v2
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  sessionOptions?: SessionOptions;
  logLevel?: LogLevel;
  children: ReactNode;
}) => {
  const logger = useMemo(() => new Logger(logLevel), []);
  const walletManager = useMemo(
    () =>
      new WalletManager(
        chains,
        assetLists,
        wallets,
        logger,
        throwErrors,
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

  useEffect(() => {
    walletManager.onMounted();
    return () => {
      setViewOpen(false);
      walletManager.onUnmounted();
    };
  }, []);

  return (
    <walletContext.Provider
      value={{ walletManager, modalProvided: Boolean(ProvidedWalletModal) }}
    >
      {ProvidedWalletModal && (
        <ProvidedWalletModal
          isOpen={isViewOpen}
          setOpen={setViewOpen}
          walletRepo={viewWalletRepo}
        />
      )}
      {children}
    </walletContext.Provider>
  );
};
