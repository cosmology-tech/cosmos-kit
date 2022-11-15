/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetList, Chain } from '@chain-registry/types';
import { ColorMode, ColorModeProvider } from '@chakra-ui/react';
import {
  ChainName,
  EndpointOptions,
  MainWalletBase,
  MainWalletData,
  SessionOptions,
  SignerOptions,
  StorageOptions,
  ViewOptions,
  WalletManager,
  WalletName,
} from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import { ThemeProvider } from '@emotion/react';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DefaultModal } from './modal';
import { defaultTheme } from './modal/theme';

const ModalChakraProvider = ({
  mode,
  children,
}: {
  mode: ColorMode;
  children: ReactNode;
}) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <ColorModeProvider
        value={mode}
        options={{
          useSystemColorMode: false,
          initialColorMode: 'light',
        }}
      >
        {children}
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export const walletContext = createContext<{
  walletManager: WalletManager;
} | null>(null);

export const WalletProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  signerOptions,
  viewOptions,
  endpointOptions,
  storageOptions,
  children,
}: {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: MainWalletBase[];
  walletModal?: ({ isOpen, setOpen }: WalletModalProps) => JSX.Element;
  signerOptions?: SignerOptions;
  viewOptions?: ViewOptions;
  endpointOptions?: EndpointOptions;
  storageOptions?: StorageOptions;
  sessionOptions?: SessionOptions;
  children: ReactNode;
}) => {
  const walletManager = useMemo(
    () =>
      new WalletManager(
        chains,
        assetLists,
        wallets,
        signerOptions,
        viewOptions,
        endpointOptions,
        storageOptions
      ),
    []
  );

  const [walletData, setWalletData] = useState<MainWalletData>();
  const [walletState, setWalletState] = useState(walletManager.state);
  const [walletMsg, setWalletMsg] = useState<string | undefined>();
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    walletManager.currentWalletName
  );

  const [isViewOpen, setViewOpen] = useState<boolean>(false);
  const [chainName, setChainName] = useState<ChainName | undefined>();
  const [qrUrl, setQRUrl] = useState<string | undefined>();

  walletManager.setActions({
    data: setWalletData,
    state: setWalletState,
    message: setWalletMsg,
    walletName: setWalletName,
    viewOpen: setViewOpen,
    chainName: setChainName,
    qrUrl: setQRUrl,
  });

  const Modal = walletModal || DefaultModal;

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
      {children}
      <Modal isOpen={isViewOpen} setOpen={setViewOpen} />
    </walletContext.Provider>
  );
};
