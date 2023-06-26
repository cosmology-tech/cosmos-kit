import { ChainName, ChainWalletContext, WalletName } from '@cosmos-kit/core';
import { useContext } from 'react';

import { walletContext } from '../provider';
import { getChainWalletContext } from '../utils';

export const useChainWallet = (
  chainName: ChainName,
  walletName: WalletName,
  sync = true
): ChainWalletContext => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager } = context;

  const wallet = walletManager.getChainWallet(chainName, walletName);
  wallet.activate();
  return getChainWalletContext(wallet.chain.chain_id, wallet, sync);
};
