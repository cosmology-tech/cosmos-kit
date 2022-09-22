import { ChainName, MainWalletData, SignerOptions, ViewOptions, WalletManager, WalletName, WalletRecord } from '@cosmos-kit/core';
import { WalletModalProps } from '@cosmos-kit/core';
import React, { createContext, ReactNode, useState } from 'react';

import { DefaultModal } from './modal';
import { Chain } from '@chain-registry/types';

export const walletContext = createContext<{ walletManager: WalletManager } | null>(null);

export const WalletProvider = ({
  chains,
  wallets,
  walletModal,
  signerOptions,
  viewOptions,
  children,
}: {
  chains: Chain[],
  wallets: WalletRecord[],
  walletModal?: ({
    isOpen,
    setOpen,
  }: WalletModalProps) => JSX.Element;
  signerOptions?: SignerOptions,
  viewOptions?: ViewOptions;
  children: ReactNode;
}) => {

  const walletManager = new WalletManager(
    chains,
    wallets,
    signerOptions,
    viewOptions
  );

  const [walletData, setWalletData] = useState<MainWalletData>();
  const [walletState, setWalletState] = useState(walletManager.state);
  const [walletMsg, setWalletMsg] = useState<string | undefined>();
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    walletManager.currentWalletName
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
