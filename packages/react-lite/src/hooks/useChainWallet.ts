import {
  ChainWalletContext,
  ChainName,
  WalletName,
  ChainWalletConverter,
} from '@cosmos-kit/core';
import {
  CosmosChainWallet,
  CosmosChainWalletContext,
  CosmosChainWalletConverter,
  isCosmosChain,
} from '@cosmos-kit/cosmos';
import React, { useMemo } from 'react';

import { walletContext } from '../provider';

export const useChainWallet = (
  chainName: ChainName,
  walletName: WalletName
): ChainWalletContext | CosmosChainWalletContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager } = context;

  const wallet = walletManager.getChainWallet(chainName, walletName);
  wallet.activate();

  const converter = useMemo(() => {
    if (isCosmosChain(chainName)) {
      const cosmosWallet = new CosmosChainWallet(wallet);
      return new CosmosChainWalletConverter(cosmosWallet);
    } else {
      return new ChainWalletConverter(wallet);
    }
  }, []);

  return converter.getChainWalletContext();
};
