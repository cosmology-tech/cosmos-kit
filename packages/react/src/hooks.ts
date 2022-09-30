import { WalletManager } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';

export const useWallet = (): WalletManager => {
  const context = React.useContext(walletContext);

  if (!context || !context.walletManager) {
    throw new Error('You have forgot to use WalletProvider');
  }

  return context.walletManager;
};
