import { WalletManager } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';

export const useWallet = (): WalletManager => {

  const { walletManager } = React.useContext(walletContext);

  if (!walletManager) {
    throw new Error('You have forgot to use WalletProvider');
  }

  return walletManager;
};
