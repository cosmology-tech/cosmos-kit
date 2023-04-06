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
import React from 'react';

import { walletContext } from '../provider';

export const useChainWallet = (
  chainName: ChainName,
  walletName: WalletName,
  sync: boolean = true
): ChainWalletContext | CosmosChainWalletContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager } = context;

  const wallet = walletManager.getChainWallet(chainName, walletName);
  wallet.activate();

  if (isCosmosChain(chainName)) {
    const converter = new CosmosChainWalletConverter(
      new CosmosChainWallet(wallet)
    );
    return converter.getCosmosChainWalletContext(sync);
  } else {
    const converter = new ChainWalletConverter(wallet);
    return converter.getChainWalletContext(sync);
  }
};
