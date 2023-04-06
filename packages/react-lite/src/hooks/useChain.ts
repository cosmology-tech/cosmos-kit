import {
  ChainContext,
  ChainName,
  ChainWalletConverter,
} from '@cosmos-kit/core';
import {
  CosmosChainContext,
  CosmosChainWallet,
  CosmosChainWalletConverter,
  isCosmosChain,
} from '@cosmos-kit/cosmos';
import { CosmosWalletRepo } from '@cosmos-kit/cosmos/src/repository';
import React, { useMemo } from 'react';

import { walletContext } from '../provider';

export const useChain = (
  chainName: ChainName,
  sync: boolean = true
): ChainContext | CosmosChainContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager, modalProvided } = context;

  if (!modalProvided) {
    throw new Error(
      'You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead.'
    );
  }

  const converter = useMemo(() => {
    const repo = walletManager.getWalletRepo(chainName);
    repo.activate();
    if (isCosmosChain(chainName)) {
      const cosmosWalletRepo = new CosmosWalletRepo(repo);
      const cosmosChainWallet = new CosmosChainWallet(repo.current);
      const converter = new CosmosChainWalletConverter(
        cosmosChainWallet,
        cosmosWalletRepo
      );
      return converter.getCosmosChainContext(sync);
    } else {
      const converter = new ChainWalletConverter(repo.current, repo);
      return converter.getChainContext(sync);
    }
  }, [chainName]);
};
