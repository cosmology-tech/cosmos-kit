import { ManagerContext } from '@cosmos-kit/core';
import { useContext } from 'react';

import { walletContext } from '../provider';

export const useManager = (): ManagerContext => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const {
    walletManager: {
      mainWallets,
      chainRecords,
      walletRepos,
      defaultNameService,
      getChainRecord,
      getWalletRepo,
      addChains,
      addEndpoints,
      getChainLogo,
      getNameService,
      on,
      off,
    },
  } = context;

  return {
    chainRecords,
    walletRepos,
    mainWallets,
    defaultNameService,
    getChainRecord,
    getWalletRepo,
    addChains,
    addEndpoints,
    getChainLogo,
    getNameService,
    on,
    off,
  };
};
