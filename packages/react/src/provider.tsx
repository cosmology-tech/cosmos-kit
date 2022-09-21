import { ChainName, MainWalletData, WalletManager, WalletName } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useState } from 'react';
import { chainInfos, walletInfos } from '@cosmos-kit/config';

import { DefaultModal } from './modal';

export const walletContext = createContext<{ walletManager: WalletManager } | null>(null);

export const WalletProvider = ({
  walletModal,
  walletManager,
  children,
}: {
  walletModal?: ({
    isOpen,
    setOpen,
  }: WalletModalProps) => JSX.Element;
  walletManager?: WalletManager;
  children: ReactNode;
}) => {

  if (!walletManager) {

    walletManager = new WalletManager(
      chainInfos,
      walletInfos
    )

    walletManager.setAutos({
      closeViewWhenWalletIsConnected: false,
      closeViewWhenWalletIsDisconnected: true,
      closeViewWhenWalletIsRejected: false,
    });
  }

  const {
    state,
    currentWalletName
  } = walletManager;

  const [walletData, setWalletData] = useState<MainWalletData>();
  const [walletState, setWalletState] = useState(state);
  const [walletMsg, setWalletMsg] = useState<string | undefined>();
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    currentWalletName
  );

  const [isViewOpen, setViewOpen] = useState<boolean>(false);
  const [chainName, setChainName] = useState<ChainName | undefined>();
  const [qrUri, setQRUri] = useState<string | undefined>();

  walletManager.setActions({
    data: setWalletData,
    state: setWalletState,
    message: setWalletMsg,
    walletName: setWalletName,
    viewOpen: setViewOpen,
    chainName: setChainName,
    qrUri: setQRUri,
  });

  const Modal = walletModal || DefaultModal;

  return (
    <walletContext.Provider
      value={{
        walletManager
      }}
    >
      {children}
      <Modal
        isOpen={isViewOpen}
        setOpen={setViewOpen}
      />
    </walletContext.Provider>
  );
};
