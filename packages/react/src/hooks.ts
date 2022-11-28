import { ChainContext, ChainName, WalletManager } from '@cosmos-kit/core';
import React, { useEffect } from 'react';

import { walletContext } from './provider';
import { walletContextV2 } from './provider-v2';

export const useWallet = (): WalletManager => {
  const context = React.useContext(walletContext);

  if (!context || !context.walletManager) {
    throw new Error('You have forgot to use WalletProvider.');
  }

  return context.walletManager;
};

export const useChain = (chainName: ChainName): ChainContext => {
  const context = React.useContext(walletContextV2);

  if (!context) {
    throw new Error('You have forgot to use WalletProviderV2.');
  }

  const { walletManager, deps } = context;
  const walletRepo = walletManager.getWalletRepo(chainName);
  const {
    connect,
    disconnect,
    openView,
    getWallet,
    current,
    chainRecord: { chain, assetList },
  } = walletRepo;

  useEffect(() => {
    const walletName = window.localStorage.getItem('cosmoskit-v2-wallet');
    if (walletManager.options.synchroMutexWallet) {
      if (!walletName) {
        disconnect();
      } else if (walletName && !getWallet(walletName).isDone) {
        connect(walletName);
      }
    }
  }, deps);

  return {
    address: current?.address,
    username: current?.username,
    message: current?.message,
    status: current?.walletStatus,
    connect,
    disconnect,
    openView,
    chain,
    assets: assetList,
    walletRepo: walletRepo,
    wallet: current,
  };
};
