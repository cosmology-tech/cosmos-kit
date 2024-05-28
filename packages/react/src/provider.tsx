import { AssetList, Chain } from '@chain-registry/types';
import {
  ChainName,
  EndpointOptions,
  Logger,
  LogLevel,
  MainWalletBase,
  ModalOptions,
  NameServiceName,
  SessionOptions,
  SignerOptions,
  WalletConnectOptions,
  WalletModalProps,
} from '@cosmos-kit/core';
import { ChainProvider as ChainProviderLite } from '@cosmos-kit/react-lite';
import { ReactNode, useCallback, useMemo } from 'react';

import { ThemeCustomizationProps, WalletModal } from './modal';
import { defaultModalViews } from './modal/components/views';
import { SelectedWalletRepoProvider } from './context';

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  modalViews,
  throwErrors = false,
  subscribeConnectEvents = true,
  defaultNameService = 'icns',
  walletConnectOptions,
  signerOptions,
  endpointOptions,
  sessionOptions,
  logLevel = 'WARN',
  allowedIframeParentOrigins = [
    'https://app.osmosis.zone',
    'https://daodao.zone',
    'https://dao.daodao.zone',
  ],
  children,
  modalTheme = {},
  modalOptions,
}: {
  chains: (Chain | ChainName)[];
  assetLists?: AssetList[];
  wallets: MainWalletBase[];
  walletModal?: (props: WalletModalProps) => JSX.Element;
  modalViews?: typeof defaultModalViews;
  throwErrors?: boolean | 'connect_only';
  subscribeConnectEvents?: boolean;
  defaultNameService?: NameServiceName;
  walletConnectOptions?: WalletConnectOptions; // SignClientOptions is required if using wallet connect v2
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  sessionOptions?: SessionOptions;
  logLevel?: LogLevel;
  /**
   * Origins to allow wrapping this app in an iframe and connecting to this
   * Cosmos Kit instance.
   *
   * Defaults to Osmosis and DAO DAO.
   */
  allowedIframeParentOrigins?: string[];
  children: ReactNode;
  modalTheme?: ThemeCustomizationProps;
  modalOptions?: ModalOptions;
}) => {
  const logger = useMemo(() => new Logger(logLevel), []);

  const withChainProvider = (
    modal: (props: WalletModalProps) => JSX.Element
  ) => (
    <SelectedWalletRepoProvider>
      <ChainProviderLite
        chains={chains}
        assetLists={assetLists}
        wallets={wallets}
        walletModal={modal}
        throwErrors={throwErrors}
        subscribeConnectEvents={subscribeConnectEvents}
        defaultNameService={defaultNameService}
        walletConnectOptions={walletConnectOptions}
        signerOptions={signerOptions}
        endpointOptions={endpointOptions}
        sessionOptions={sessionOptions}
        logLevel={logLevel}
        allowedIframeParentOrigins={allowedIframeParentOrigins}
      >
        {children}
      </ChainProviderLite>
    </SelectedWalletRepoProvider>
  );

  if (walletModal) {
    logger.debug('Using provided wallet modal.');
    return withChainProvider(walletModal);
  }

  logger.debug('Using default wallet modal.');

  const defaultModal = useCallback(
    (props: WalletModalProps) => (
      <WalletModal
        {...props}
        {...modalTheme}
        modalViews={{
          ...defaultModalViews,
          ...modalViews,
        }}
        modalOptions={modalOptions}
      />
    ),
    [defaultModalViews]
  );
  return withChainProvider(defaultModal);
};
