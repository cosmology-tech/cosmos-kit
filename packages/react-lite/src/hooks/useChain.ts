import { ChainContext, ChainName, WalletStatus } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from '../provider';

export const useChain = (chainName: ChainName): ChainContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const { walletManager } = context;
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

  const status = current?.walletStatus || WalletStatus.Disconnected;

  return {
    walletRepo: walletRepo,
    chainWallet: current,
    // client: current?.client,
    // clientStatus: current?.clientMutable.state,
    // clientMessage: current?.clientMutable.message,

    chain,
    assets: assetList,
    logoUrl: current?.chainLogoUrl,
    wallet: current?.walletInfo,
    address: current?.address,
    username: current?.username,
    message: current ? current.message : 'No wallet is connected currently.',
    status,

    isWalletDisconnected: status === 'Disconnected',
    isWalletConnecting: status === 'Connecting',
    isWalletConnected: status === 'Connected',
    isWalletRejected: status === 'Rejected',
    isWalletNotExist: status === 'NotExist',
    isWalletError: status === 'Error',

    openView,
    closeView,
    connect,
    disconnect: () => disconnect(void 0, true),
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
    getNameService,

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

    enable: () =>
      clientMethodAssert(
        current?.client?.enable.bind(current.client),
        [chainId],
        'enable'
      ),
    getAccount: () =>
      clientMethodAssert(
        current?.client?.getAccount.bind(current.client),
        [chainId],
        'getAccount'
      ),
    getOfflineSigner: () =>
      clientMethodAssert(
        current?.client?.getOfflineSigner.bind(current.client),
        [chainId],
        'getOfflineSigner'
      ),
    getOfflineSignerAmino: () =>
      clientMethodAssert(
        current?.client?.getOfflineSignerAmino.bind(current.client),
        [chainId],
        'getOfflineSignerAmino'
      ),
    getOfflineSignerDirect: () =>
      clientMethodAssert(
        current?.client?.getOfflineSignerDirect.bind(current.client),
        [chainId],
        'getOfflineSignerDirect'
      ),
    signAmino: (...params: Parameters<ChainContext['signAmino']>) =>
      clientMethodAssert(
        current?.client?.signAmino.bind(current.client),
        [chainId, ...params],
        'signAmino'
      ),
    signDirect: (...params: Parameters<ChainContext['signDirect']>) =>
      clientMethodAssert(
        current?.client?.signDirect.bind(current.client),
        [chainId, ...params],
        'signDirect'
      ),
    sendTx: (...params: Parameters<ChainContext['sendTx']>) =>
      clientMethodAssert(
        current?.client?.sendTx.bind(current.client),
        [chainId, ...params],
        'sendTx'
      ),
  };
};
