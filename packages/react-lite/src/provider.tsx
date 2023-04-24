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
  WalletClientOptionsMap,
  WalletConnectOptions,
  WalletManager,
  WalletModalProps,
  WalletRepoBase,
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
  defaultNameService = 'icns',
  walletClientOptionsMap,
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
  defaultNameService?: NameServiceName;
  walletConnectOptions?: WalletConnectOptions; // SignClientOptions is required if using wallet connect v2
  walletClientOptionsMap?: WalletClientOptionsMap;
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
        defaultNameService,
        walletClientOptionsMap,
        signerOptions,
        endpointOptions,
        sessionOptions
      ),
    []
  );

  const [isViewOpen, setViewOpen] = useState<boolean>(false);

  const [data, setData] = useState<Data>();
  const [state, setState] = useState<State>(State.Init);
  const [msg, setMsg] = useState<string | undefined>();
  const [clientState, setClientState] = useState<State>(State.Init);

  walletManager.setActions({
    viewOpen: setViewOpen,
    data: setData,
    state: setState,
    message: setMsg,
  });

  walletManager.walletRepos.forEach((wr) => {
    wr.setActions({
      viewOpen: setViewOpen,
    });
    wr.wallets.forEach((w) => {
      w.setActions({
        data: setData,
        state: setState,
        message: setMsg,
        clientState: setClientState,
      });
    });
  });

  const viewWalletRepos = useMemo(() => walletManager.getActiveWalletRepos(), [
    data,
    state,
    msg,
    clientState,
  ]);

  useEffect(() => {
    walletManager.onMounted();
    return () => {
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
          walletRepos={viewWalletRepos}
        />
      )}
      {children}
    </walletContext.Provider>
  );
};
