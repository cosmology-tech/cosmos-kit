import { ChainName, getWalletStatusFromState, WalletManager, WalletName, WalletStatus } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';

export const useWallet = (chainName?: ChainName): {
  connect: () => void;
  disconnect: () => void;
  walletStatus: WalletStatus;
  username?: string;
  address?: string;
  message?: string;
  walletManager: WalletManager
} => {
  const wallet = React.useContext(walletContext);

  if (!wallet) {
    throw new Error('You have forgot to use WalletProvider');
  }

  const { 
    walletManager, 
    setModalOpen,
    data,
    state,
    message
  } = wallet;

  const {
    connect,
    disconnect,
    useModal,
    currentWalletName
  } = walletManager;

  if (walletManager.currentChainName !== chainName) {
    walletManager.setCurrentChain(chainName);
  }

  return {
    connect:
      useModal ? () => setModalOpen(true) : connect,
    disconnect:
      useModal ? () => setModalOpen(true) : disconnect,
    walletStatus: getWalletStatusFromState(state),
    username: data?.username as string,
    address: data?.address as string,
    message,
    walletManager
  };
};
