import { WalletName, WalletContext, WalletStatus } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from '../provider';

export const useWallet = (
  walletName?: WalletName,
  activeOnly = true
): WalletContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager } = context;
  const mainWallet = walletName
    ? walletManager.getMainWallet(walletName)
    : walletManager.mainWallets.find((w) => w.isActive);

  if (!mainWallet) {
    return {
      mainWallet,
      chainWallets: [],
      wallet: void 0,
      status: WalletStatus.Disconnected,
      message: void 0,
    };
  }

  const {
    walletInfo,
    getChainWalletList,
    getGlobalStatusAndMessage,
  } = mainWallet;

  const [globalStatus, globalMessage] = getGlobalStatusAndMessage(activeOnly);

  return {
    mainWallet,
    chainWallets: getChainWalletList(activeOnly),
    wallet: walletInfo,
    status: globalStatus,
    message: globalMessage,
  };
};
