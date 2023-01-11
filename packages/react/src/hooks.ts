/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChainContext,
  ChainName,
  ManagerContext,
  WalletStatus,
} from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';

export const useManager = (): ManagerContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const {
    walletManager: {
      addChains,
      chainRecords,
      walletRepos,
      getChainRecord,
      getWalletRepo,
      getChainLogo,
    },
  } = context;

  return {
    chainRecords,
    walletRepos,
    getChainRecord,
    getWalletRepo,
    addChains,
    getChainLogo,
  };
};

export const useChain = (chainName: ChainName): ChainContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
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

  function connectionAssert(
    func: ((...params: any[]) => any | undefined) | undefined,
    params: any[] = [],
    name: string
  ) {
    if (!current) {
      throw new Error(`Wallet not connected yet.`);
    }

    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${current?.walletInfo.prettyName} yet.`
      );
    }

    return func(...params);
  }

  function clientMethodAssert(
    func: ((...params: any[]) => any | undefined) | undefined,
    params: any[] = [],
    name: string
  ) {
    if (!current) {
      throw new Error(`Wallet not connected yet.`);
    }

    if (!current?.client) {
      throw new Error(`Wallet Client not defined.`);
    }

    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${current?.walletInfo.prettyName} Client yet.`
      );
    }

    return func(...params);
  }

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
    getSigningStargateClient: () =>
      connectionAssert(
        current?.getSigningStargateClient,
        [],
        'getSigningStargateClient'
      ),
    getSigningCosmWasmClient: () =>
      connectionAssert(
        current?.getSigningCosmWasmClient,
        [],
        'getSigningCosmWasmClient'
      ),
    estimateFee: (...params: Parameters<ChainContext['estimateFee']>) =>
      connectionAssert(current?.estimateFee, params, 'estimateFee'),
    sign: (...params: Parameters<ChainContext['sign']>) =>
      connectionAssert(current?.sign, params, 'sign'),
    broadcast: (...params: Parameters<ChainContext['broadcast']>) =>
      connectionAssert(current?.broadcast, params, 'broadcast'),
    signAndBroadcast: (
      ...params: Parameters<ChainContext['signAndBroadcast']>
    ) =>
      connectionAssert(current?.signAndBroadcast, params, 'signAndBroadcast'),

    enable: (chainIds?: string | string[]) =>
      clientMethodAssert(
        current?.client?.enable,
        [chainIds || chainId],
        'enable'
      ),
    getOfflineSigner: () =>
      clientMethodAssert(
        current?.client?.getOfflineSigner,
        [chainId],
        'getOfflineSigner'
      ),
    getOfflineSignerAmino: () =>
      clientMethodAssert(
        current?.client?.getOfflineSignerAmino,
        [chainId],
        'getOfflineSignerAmino'
      ),
    getOfflineSignerDirect: () =>
      clientMethodAssert(
        current?.client?.getOfflineSignerDirect,
        [chainId],
        'getOfflineSignerDirect'
      ),
    signAmino: (...params: Parameters<ChainContext['signAmino']>) =>
      clientMethodAssert(
        current?.client?.signAmino,
        [chainId, ...params],
        'signAmino'
      ),
    signDirect: (...params: Parameters<ChainContext['signDirect']>) =>
      clientMethodAssert(
        current?.client?.signDirect,
        [chainId, ...params],
        'signDirect'
      ),
    sendTx: (...params: Parameters<ChainContext['sendTx']>) =>
      clientMethodAssert(
        current?.client?.sendTx,
        [chainId, ...params],
        'sendTx'
      ),
  };
};
