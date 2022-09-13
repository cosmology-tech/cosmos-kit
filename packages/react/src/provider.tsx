import { ChainName, ExtendedWalletData, WalletManager, WalletName } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { DefaultModal } from './modal';

export const walletContext = createContext<{ walletManager: WalletManager } | null>(null);

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
  }: WalletModalProps) => JSX.Element;
  walletManager: WalletManager;
  children: ReactNode;
}) => {
  
  const {
    state,
    connect,
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
    if (walletManager.autos?.connectWhenInit) {
      connect();
    }
  }, []);
  
  return (
    <walletContext.Provider
      value={{
        walletManager
      }}
    >
      {children}
      <Modal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        chainName={chainName}
      />
    </walletContext.Provider>
  );
};
