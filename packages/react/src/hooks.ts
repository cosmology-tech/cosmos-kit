import { ChainName, WalletManager } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';

export const useWallet = (chainName?: ChainName): WalletManager => {

  const { walletManager } = React.useContext(walletContext);

  if (chainName !== walletManager.currentChainName) {
    walletManager.setCurrentChain(chainName);
  }

  if (!walletManager) {
    throw new Error('You have forgot to use WalletProvider');
  }

  return walletManager;
};
