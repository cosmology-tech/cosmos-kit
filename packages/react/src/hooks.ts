/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChainContext,
  ChainName,
  getNameServiceRegistryFromName,
  ManagerContext,
  Mutable,
  NameService,
  NameServiceName,
  State,
  WalletStatus,
  WalletClient,
} from '@cosmos-kit/core';
import React, { useState } from 'react';

import { walletContext } from './provider';

export const useManager = (): ManagerContext => {
  const context = React.useContext(walletContext);

  if (!context) {
    throw new Error('You have forgot to use ChainProvider.');
  }

  const {
    walletManager: {
      chainRecords,
      walletRepos,
      defaultNameService,
      getChainRecord,
      getWalletRepo,
      addChains,
      getChainLogo,
      getNameService,
    },
  } = context;

  return {
    chainRecords,
    walletRepos,
    defaultNameService,
    getChainRecord,
    getWalletRepo,
    addChains,
    getChainLogo,
    getNameService,
  };
};

export const useNameService = (
  name?: NameServiceName
): Mutable<NameService> => {
  const [state, setState] = useState<State>(State.Pending);
  const [ns, setNs] = useState<NameService>();
  const [msg, setMsg] = useState<string>();

  const { defaultNameService } = useManager();
  const registry = getNameServiceRegistryFromName(name || defaultNameService);
  if (!registry) {
    throw new Error('No such name service: ' + (name || defaultNameService));
  }

  const { getCosmWasmClient } = useChain(registry.chainName);

  getCosmWasmClient()
    .then((client) => {
      setNs(new NameService(client, registry));
      setState(State.Done);
    })
    .catch((e) => {
      setMsg((e as Error).message);
      setState(State.Error);
    })
    .finally(() => {
      if (state === 'Pending') {
        setState(State.Init);
      }
    });
  return {
    state,
    data: ns,
    message: msg,
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
    // walletRepo: walletRepo,
    // wallet: current,

    chain,
    assets: assetList,
    logoUrl: current?.chainLogoUrl,
    wallet: current?.walletInfo,
    address: current?.address,
    username: current?.username,
    message: current ? current.message : 'No wallet is connected currently.',
    status,
    client: current?.client,

    isWalletDisconnected: status === 'Disconnected',
    isWalletConnecting: status === 'Connecting',
    isWalletConnected: status === 'Connected',
    isWalletRejected: status === 'Rejected',
    isWalletNotExist: status === 'NotExist',
    isWalletError: status === 'Error',

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

    enable: (chainIds?: string | string[]) =>
      clientMethodAssert(
        current?.client?.enable.bind(current.client),
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
