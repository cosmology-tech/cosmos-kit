import { ChainName, ExtendedChainWalletData, ExtendedWalletData, State, WalletManager, WalletName } from '@cosmos-kit/core';
import { Dispatch, WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { DefaultModal } from './modal';

export const walletContext = createContext<{
  walletManager: WalletManager;
  setModalOpen: Dispatch<boolean>;
  data?: ExtendedWalletData | ExtendedChainWalletData;
  state: State;
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
    state,
    connect,
    useModal,
    autoConnect,
    currentWalletName
  } = walletManager;

  const [walletData, setWalletData] = useState<ExtendedWalletData>();
  const [walletState, setWalletState] = useState(state);
  const [walletMsg, setWalletMsg] = useState<string | undefined>();
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    currentWalletName
  );

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [chainName, setChainName] = useState<ChainName | undefined>();
  const [qrUri, setQRUri] = useState<string | undefined>();

  walletManager.setAction({
    data: setWalletData,
    state: setWalletState,
    message: setWalletMsg,
    walletName: setWalletName,
    modalOpen: setModalOpen,
    chainName: setChainName,
    qrUri: setQRUri,
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
        data: walletData,
        state: walletState,
        message: walletMsg
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
