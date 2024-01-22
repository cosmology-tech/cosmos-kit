import { ChainContext, ChainName, DisconnectOptions } from '@cosmos-kit/core';
import { useContext, useEffect, useMemo, useState } from 'react';

import { walletContext } from '../provider';
import { getChainWalletContext } from '../utils';

export const useChain = (chainName: ChainName, sync = true): ChainContext => {
  const context = useContext(walletContext);
  const [_, forceRender] = useState(0);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager, modalProvided } = context;

  if (!modalProvided) {
    throw new Error(
      'You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead.'
    );
  }

  const walletRepo = walletManager.getWalletRepo(chainName);
  walletRepo.activate();
  const {
    connect,
    disconnect,
    openView,
    closeView,
    current,
    chainRecord: { chain, assetList },
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService,
  } = walletRepo;

  const chainWalletContext = useMemo(() => {
    if (chain) {
      return getChainWalletContext(chain.chain_id, current, sync);
    } else {
      return void 0;
    }
  }, [chain, current, current?.state]);

  useEffect(() => {
    forceRender((i) => i + 1);
  }, [chain, assetList, chainWalletContext?.address]);

  // temporary solution for sync not working when the used chain is changed without page rendering (only component rendering)
  useEffect(() => {
    const currentWallet = window.localStorage.getItem(
      'cosmos-kit@2:core//current-wallet'
    );
    if (
      sync &&
      chainWalletContext &&
      chainWalletContext.isWalletDisconnected &&
      currentWallet
    ) {
      connect(currentWallet);
    }
  }, [chain, assetList]);

  return {
    ...chainWalletContext,
    walletRepo,
    chain,
    assets: assetList,
    openView,
    closeView,
    connect: () => connect(void 0, sync),
    disconnect: (options?: DisconnectOptions) =>
      disconnect(void 0, sync, options),
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService,
  };
};
