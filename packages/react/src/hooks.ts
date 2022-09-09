import { ChainName, getWalletStatusFromState, WalletManager, WalletName, WalletStatus } from '@cosmos-kit/core';
import React, { useEffect, useState } from 'react';

import { walletContext } from './provider';

export const useWallet = (chainName?: ChainName): {
  connect: () => void;
  disconnect: () => void;
  walletStatus: WalletStatus;
  username?: string;
  address?: string;
  walletManager: WalletManager
} => {
  const wallet = React.useContext(walletContext);

  if (!wallet) {
    throw new Error('You have forgot to use WalletProvider');
  }

  const { walletManager, setModalOpen } = wallet;

  if (walletManager.currentChainName !== chainName) {
    walletManager.setCurrentChain(chainName);
  }

  const {
    currentWallet,
    currentChainWallet,
    connect,
    disconnect,
    useModal,
    autoConnect,
    currentWalletName
  } = walletManager;

  const [walletData, setWalletData] = useState<any>();
  const [chainWalletData, setChainWalletData] = useState<any>();
  const [walletState, setWalletState] = useState(currentWallet?.state);
  const [chainWalletState, setChainWalletState] = useState(
    currentChainWallet?.state
  );
  const [walletName, setWalletName] = useState<WalletName | undefined>(
    currentWalletName
  );

  walletManager.updateAction({
    walletData: setWalletData,
    chainWalletData: setChainWalletData,
    walletState: setWalletState,
    walletName: setWalletName,
    chainWalletState: setChainWalletState,
    modalOpen: setModalOpen,
  });

  useEffect(() => {
    if (autoConnect && !useModal) {
      connect();
    }
  }, []);

  return {
    connect:
      useModal && !currentWalletName ? () => setModalOpen(true) : connect,
    disconnect,
    walletStatus: getWalletStatusFromState(chainName ? chainWalletState : walletState),
    username: walletData?.username,
    address: chainWalletData?.address,
    walletManager
  };
};
