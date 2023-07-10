import { ChainContext, ChainName } from '@cosmos-kit/core';
import { useContext, useEffect, useState } from 'react';

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

  const chainWalletContext = getChainWalletContext(
    chain.chain_id,
    current,
    sync
  );

  useEffect(() => {
    forceRender((i) => i + 1);
  }, [chainWalletContext.address]);

  return {
    ...chainWalletContext,
    walletRepo,
    chain,
    assets: assetList,
    openView,
    closeView,
    connect: () => connect(void 0, sync),
    disconnect: () => disconnect(void 0, sync),
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService,
  };
};
