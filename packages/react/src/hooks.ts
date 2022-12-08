import {
  ChainContext,
  ChainName,
  WalletManager,
  WalletStatus,
} from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';
import { walletContextV2 } from './provider-v2';

export const useWallet = (): WalletManager => {
  const context = React.useContext(walletContext);

  if (!context || !context.walletManager) {
    throw new Error('You have forgot to use WalletProvider.');
  }

  return context.walletManager;
};

export const useChain = (chainName: ChainName): ChainContext => {
  const context = React.useContext(walletContextV2);

  if (!context) {
    throw new Error('You have forgot to use WalletProviderV2.');
  }

  const { walletManager } = context;
  const walletRepo = walletManager.getWalletRepo(chainName);
  walletRepo.isInUse = true;
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
  } = walletRepo;

  const chainId = chain.chain_id;

  return {
    // walletRepo: walletRepo,
    // wallet: current,

    chain,
    assets: assetList,
    logoUrl: current?.chainLogoUrl,
    wallet: current?.walletInfo,
    address: current?.address,
    username: current?.username,
    message: current ? current.message : 'No wallet is connected currently.',
    status: current?.walletStatus || WalletStatus.Disconnected,

    openView,
    closeView,
    connect,
    disconnect,
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getSigningStargateClient: async () =>
      await current?.getSigningStargateClient(),
    getSigningCosmWasmClient: async () =>
      await current?.getSigningCosmWasmClient(),
    estimateFee: async (...props: Parameters<ChainContext['estimateFee']>) =>
      await current?.estimateFee(...props),
    sign: async (...props: Parameters<ChainContext['sign']>) =>
      await current?.sign(...props),
    broadcast: async (...props: Parameters<ChainContext['broadcast']>) =>
      await current?.broadcast(...props),
    signAndBroadcast: async (
      ...props: Parameters<ChainContext['signAndBroadcast']>
    ) => await current?.signAndBroadcast(...props),

    enable: async (chainIds?: string | string[]) => {
      await current?.client?.enable?.(chainIds || chainId);
    },
    getOfflineSigner: async () =>
      await current?.client?.getOfflineSigner(chainId),
    signAmino: async (...props: Parameters<ChainContext['signAmino']>) =>
      await current?.signAmino(...props),
    signDirect: async (...props: Parameters<ChainContext['signDirect']>) =>
      await current?.signDirect(...props),
    sendTx: async (...props: Parameters<ChainContext['sendTx']>) =>
      await current?.client?.sendTx(chainId, ...props),
  };
};
