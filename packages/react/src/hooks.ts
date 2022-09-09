import { ChainName, getWalletStatusFromState, WalletManager, WalletName, WalletStatus } from '@cosmos-kit/core';
import React, { useEffect, useState } from 'react';

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
    walletData,
    chainWalletData,
    walletState,
    chainWalletState,
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
    walletStatus: getWalletStatusFromState(chainName ? chainWalletState : walletState),
    username: walletData?.username || chainWalletData?.username as string,
    address: chainWalletData?.address,
    message,
    walletManager
  };
};
