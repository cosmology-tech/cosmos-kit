import { ChainName, ExtendedChainWalletData, ExtendedWalletData, State, WalletManager, WalletName } from '@cosmos-kit/core';
import { Dispatch, WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { DefaultModal } from './modal';

export const walletContext = createContext<{
  walletManager: WalletManager;
  setModalOpen: Dispatch<boolean>;
  walletData: ExtendedWalletData;
  chainWalletData: ExtendedChainWalletData;
  walletState: State;
  chainWalletState: State;
  message?: string
} | null>(null);

export const WalletProvider = ({
  // chainSelector,
  walletModal,
  walletManager,
  children,
}: {
  // chainSelector?: ({ name, setName, chainOptions }: ChainSelectorProps) => JSX.Element;
  walletModal?: ({
    isOpen,
    setOpen,
    chainName,
    qrUri,
  }: WalletModalProps) => JSX.Element;
  walletManager: WalletManager;
  children: ReactNode;
}) => {
  
  const {
    currentWallet,
    currentChainWallet,
    connect,
    useModal,
    autoConnect,
    currentWalletName
  } = walletManager;

  const [walletData, setWalletData] = useState<ExtendedWalletData>();
  const [chainWalletData, setChainWalletData] = useState<ExtendedChainWalletData>();
  const [walletState, setWalletState] = useState(currentWallet?.state);
  const [chainWalletState, setChainWalletState] = useState(
    currentChainWallet?.state
  );
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    currentWalletName
  );

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [chainName, setChainName] = useState<ChainName | undefined>();
  const [qrUri, setQRUri] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  walletManager.setAction({
    walletData: setWalletData,
    chainWalletData: setChainWalletData,
    walletState: setWalletState,
    walletName: setWalletName,
    chainWalletState: setChainWalletState,
    modalOpen: setModalOpen,
    chainName: setChainName,
    qrUri: setQRUri,
    message: setMessage,
  });

  // walletManager.connect = () => setModalOpen(true);
  const Modal = walletModal || DefaultModal;

  useEffect(() => {
    if (autoConnect && !useModal) {
      connect();
    }
  }, []);

  return (
    <walletContext.Provider
      value={{
        walletManager,
        setModalOpen: setModalOpen,
        walletData,
        chainWalletData,
        walletState,
        chainWalletState,
        message
      }}
    >
      {children}
      <Modal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        chainName={chainName}
        qrUri={qrUri}
      />
    </walletContext.Provider>
  );
};
