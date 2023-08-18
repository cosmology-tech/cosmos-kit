import { MainWalletBase, State } from '@cosmos-kit/core';
import { useContext } from 'react';

import { walletContext } from '../provider';

export const useConnectedWallet = (): MainWalletBase | undefined => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error('You forgot to use ChainProvider.');
  }

  const { walletManager } = context;
  const connectedWallet = walletManager.mainWallets.find(
    (w) => w.isWalletConnected && w.clientMutable.state === State.Done
  );

  return connectedWallet;
};
