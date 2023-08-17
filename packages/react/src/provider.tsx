import { AssetList, Chain } from '@chain-registry/types';
import {
  EndpointOptions,
  Logger,
  LogLevel,
  MainWalletBase,
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

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  modalViews,
  throwErrors = false,
  defaultNameService = 'icns',
  walletConnectOptions,
  signerOptions,
  endpointOptions,
  sessionOptions,
  logLevel = 'WARN',
  children,
  modalTheme = {},
}: {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: MainWalletBase[];
  walletModal?: (props: WalletModalProps) => JSX.Element;
  modalViews?: typeof defaultModalViews;
  throwErrors?: boolean;
  defaultNameService?: NameServiceName;
  walletConnectOptions?: WalletConnectOptions; // SignClientOptions is required if using wallet connect v2
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  sessionOptions?: SessionOptions;
  logLevel?: LogLevel;
  children: ReactNode;
  modalTheme?: ThemeCustomizationProps;
}) => {
  const logger = useMemo(() => new Logger(logLevel), []);

  const withChainProvider = (
    modal: (props: WalletModalProps) => JSX.Element
  ) => (
    <ChainProviderLite
      chains={chains}
      assetLists={assetLists}
      wallets={wallets}
      walletModal={modal}
      throwErrors={throwErrors}
      defaultNameService={defaultNameService}
      walletConnectOptions={walletConnectOptions}
      signerOptions={signerOptions}
      endpointOptions={endpointOptions}
      sessionOptions={sessionOptions}
      logLevel={logLevel}
    >
      {children}
    </ChainProviderLite>
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
      />
    ),
    [defaultModalViews]
  );
  return withChainProvider(defaultModal);
};
