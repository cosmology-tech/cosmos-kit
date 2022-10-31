/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetList, Chain } from '@chain-registry/types';
import {
  ChainName,
  CosmosManager,
  EndpointOptions,
  MainWalletBase,
  MainWalletData,
  SessionOptions,
  SignerOptions,
  StorageOptions,
  ViewOptions,
  WalletName,
} from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DefaultModal } from './modal';

export const walletContext = createContext<{
  cosmosManager: CosmosManager;
} | null>(null);

export const CosmosProvider = ({
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
  const cosmosManager = useMemo(
    () =>
      new CosmosManager(
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
  const [walletState, setWalletState] = useState(cosmosManager.state);
  const [walletMsg, setWalletMsg] = useState<string | undefined>();
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    cosmosManager.currentWalletName
  );

  const [isViewOpen, setViewOpen] = useState<boolean>(false);
  const [chainName, setChainName] = useState<ChainName | undefined>();
  const [qrUri, setQRUri] = useState<string | undefined>();

  cosmosManager.setActions({
    data: setWalletData,
    state: setWalletState,
    message: setWalletMsg,
    walletName: setWalletName,
    viewOpen: setViewOpen,
    chainName: setChainName,
    qrUri: setQRUri,
  });

  const Modal = walletModal || DefaultModal;

  useEffect(() => {
    cosmosManager.onMounted();
    return () => {
      cosmosManager.onUnmounted();
    };
  }, []);

  return (
    <walletContext.Provider
      value={{
        cosmosManager,
      }}
    >
      {children}
      <Modal isOpen={isViewOpen} setOpen={setViewOpen} />
    </walletContext.Provider>
  );
};
