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

  async function clientMethodAssert(
    func: (...params: any) => any,
    params: any[],
    name: string,
    returnVoid?: boolean
  ) {
    if (func) {
      return await func(...params);
    }

    if (current?.client) {
      throw new Error(
        `Function ${name} not implemented by wallet ${current?.walletInfo.prettyName} yet.`
      );
    }

    if (!returnVoid) {
      return void 0;
    }
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
    getSigningStargateClient: () => current?.getSigningStargateClient(),
    getSigningCosmWasmClient: () => current?.getSigningCosmWasmClient(),
    estimateFee: (...props: Parameters<ChainContext['estimateFee']>) =>
      current?.estimateFee(...props),
    sign: (...props: Parameters<ChainContext['sign']>) =>
      current?.sign(...props),
    broadcast: (...props: Parameters<ChainContext['broadcast']>) =>
      current?.broadcast(...props),
    signAndBroadcast: (
      ...props: Parameters<ChainContext['signAndBroadcast']>
    ) => current?.signAndBroadcast(...props),

    enable: (chainIds?: string | string[]) =>
      clientMethodAssert(
        current?.client?.enable,
        [chainIds || chainId],
        'enable',
        true
      ),
    getOfflineSigner: async () =>
      clientMethodAssert(
        current?.client?.getOfflineSigner,
        [chainId],
        'getOfflineSigner'
      ),
    signAmino: (...props: Parameters<ChainContext['signAmino']>) =>
      clientMethodAssert(
        current?.client?.signAmino,
        [chainId, ...props],
        'signAmino'
      ),
    signDirect: (...props: Parameters<ChainContext['signDirect']>) =>
      clientMethodAssert(
        current?.client?.signDirect,
        [chainId, ...props],
        'signDirect'
      ),
    sendTx: (...props: Parameters<ChainContext['sendTx']>) =>
      clientMethodAssert(
        current?.client?.sendTx,
        [chainId, ...props],
        'sendTx'
      ),
  };
};
