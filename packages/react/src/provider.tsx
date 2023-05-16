import { AssetList, Chain } from '@chain-registry/types';
import {
  EndpointOptions,
  Logger,
  LogLevel,
  MainWalletBase,
  ModalViews,
  NameServiceName,
  SessionOptions,
  SignerOptions,
  WalletConnectOptions,
  WalletModalProps,
} from '@cosmos-kit/core';
import { ChainProvider as ChainProviderLite } from '@cosmos-kit/react-lite';
import React, { ReactNode, useCallback, useMemo } from 'react';

import { WalletModal } from '.';
import {
  ChakraProviderWithGivenTheme,
  ChakraProviderWithOuterTheme,
} from './modal/components';
import { defaultModalViews } from './modal/components/views';

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  modalTheme,
  modalViews,
  includeAllWalletsOnMobile = false,
  wrappedWithChakra = false,
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
  modalTheme?: Record<string, any>;
  modalViews?: ModalViews;
  includeAllWalletsOnMobile?: boolean;
  wrappedWithChakra?: boolean;
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
  if (wrappedWithChakra && modalTheme) {
    logger.warn(
      'Your are suggesting there already been a Chakra Theme active in higher level (with `wrappedWithChakra` is true). `modalTheme` will not work in this case.'
    );
  }

  const getChainProvider = (
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
    return getChainProvider(walletModal);
  }

  logger.debug('Using default wallet modal.');

  const defaultModal = useCallback(
    (props: WalletModalProps) => (
      <WalletModal
        {...props}
        modalViews={{
          ...defaultModalViews,
          ...modalViews,
        }}
        includeAllWalletsOnMobile={includeAllWalletsOnMobile}
      />
    ),
    [defaultModalViews]
  );

  if (wrappedWithChakra) {
    logger.debug('Wrap with <ChakraProviderWithOuterTheme>.');
    return (
      <ChakraProviderWithOuterTheme logger={logger}>
        {getChainProvider(defaultModal)}
      </ChakraProviderWithOuterTheme>
    );
  } else {
    logger.debug('Wrap with <ChakraProviderWithGivenTheme>.');
    return (
      <ChakraProviderWithGivenTheme theme={modalTheme} logger={logger}>
        {getChainProvider(defaultModal)}
      </ChakraProviderWithGivenTheme>
    );
  }
};
