import { ChainName, WalletManager } from '@cosmos-kit/core';
import { Dispatch, WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useState } from 'react';

import { DefaultModal } from './modal';

export const walletContext = createContext<{
  walletManager: WalletManager;
  setModalOpen: Dispatch<boolean>;
} | null>(null);

export const WalletProvider = ({
  // chainSelector,
  walletModal,
  walletManager,
  children,
}: {
  // chainSelector?: ({ name, setName, chainOptions }: ChainSelectorProps) => JSX.Element;
  walletModal?: ({
    isOpen: open,
    setOpen,
    chainName,
    qrUri,
  }: WalletModalProps) => JSX.Element;
  walletManager: WalletManager;
  children: ReactNode;
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [chainName, setChainName] = useState<ChainName | undefined>();
  const [qrUri, setQRUri] = useState<string | undefined>();

  walletManager.updateAction({
    modalOpen: setModalOpen,
    chainName: setChainName,
    qrUri: setQRUri,
  });

  // walletManager.connect = () => setModalOpen(true);
  const Modal = walletModal || DefaultModal;

  return (
    <walletContext.Provider
      value={{
        walletManager,
        setModalOpen: setModalOpen,
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
