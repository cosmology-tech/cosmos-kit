import { State, WalletClientContext, WalletName } from '@cosmos-kit/core';
import { useContext } from 'react';

import { walletContext } from '../provider';

export const useWalletClient = (
  walletName?: WalletName
): WalletClientContext => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager } = context;

  const mainWallet = walletName
    ? walletManager.getMainWallet(walletName)
    : walletManager.mainWallets.find((w) => w.isActive);

  if (!mainWallet) {
    return {
      client: void 0,
      status: State.Init,
      message: void 0,
    };
  }

  const { clientMutable } = mainWallet;

  return {
    client: clientMutable.data,
    status: clientMutable.state,
    message: clientMutable.message,
  };
};
