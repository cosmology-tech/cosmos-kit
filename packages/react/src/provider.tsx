/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetList, Chain } from '@chain-registry/types';
import {
  ChainName,
  EndpointOptions,
  MainWalletBase,
  MainWalletData,
  ModalVersion,
  SessionOptions,
  SignerOptions,
  StorageOptions,
  ViewOptions,
  WalletManager,
  WalletName,
  NameResolver,
} from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DefaultModal } from '.';
import { getModal } from './modal';

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
  sessionOptions,
  nameResolver,
  children,
}: {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: MainWalletBase[];
  walletModal?:
    | ModalVersion
    | (({ isOpen, setOpen }: WalletModalProps) => JSX.Element);
  signerOptions?: SignerOptions;
  viewOptions?: ViewOptions;
  endpointOptions?: EndpointOptions;
  storageOptions?: StorageOptions;
  sessionOptions?: SessionOptions;
  nameResolver?: NameResolver;
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
        storageOptions,
        sessionOptions,
        nameResolver
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

  const Modal = useMemo(() => {
    if (!walletModal) {
      return DefaultModal;
    } else if (typeof walletModal === 'string') {
      return getModal(walletModal as ModalVersion);
    } else {
      return walletModal;
    }
  }, [walletModal]);

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
