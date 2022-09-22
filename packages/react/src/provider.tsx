import { ChainName, MainWalletData, WalletManager, WalletName } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useState } from 'react';
import { chainInfos, walletInfos } from '@cosmos-kit/config';

import { DefaultModal } from './modal';

const defaultWalletManager = new WalletManager(
  chainInfos,
  walletInfos
)

defaultWalletManager.setAutos({
  closeViewWhenWalletIsConnected: false,
  closeViewWhenWalletIsDisconnected: true,
  closeViewWhenWalletIsRejected: false,
});

export const walletContext = createContext<{ walletManager: WalletManager } | null>(null);

export const WalletProvider = ({
  walletModal,
  walletManager: _walletManager,
  children,
}: {
  walletModal?: ({
    isOpen,
    setOpen,
  }: WalletModalProps) => JSX.Element;
  walletManager?: WalletManager;
  children: ReactNode;
}) => {

  let walletManager: WalletManager;
  if (!walletManager) {
    walletManager = defaultWalletManager;
  } else {
    walletManager = _walletManager;
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
