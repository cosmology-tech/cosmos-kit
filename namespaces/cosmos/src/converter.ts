import { ChainWalletConverter } from '@cosmos-kit/core';
import { CosmosChainWallet } from './chain-wallet';
import { CosmosWalletRepo } from './repository';
import { CosmosChainContext, CosmosChainWalletContext } from './types';

export class CosmosChainWalletConverter extends ChainWalletConverter {
  wallet?: CosmosChainWallet;
  walletRepo?: CosmosWalletRepo;

  constructor(wallet?: CosmosChainWallet, walletRepo?: CosmosWalletRepo) {
    super(wallet, walletRepo);
  }

  getChainContext(): CosmosChainContext {
    if (!this.walletRepo) {
      throw new Error(`WalletRepo is undefined.`);
    }

    const { getStargateClient, getCosmWasmClient } = this.walletRepo;

    return {
      ...this.getChainWalletContext(),
      ...this._getChainContext(),
      getStargateClient,
      getCosmWasmClient,
    };
  }

  getChainWalletContext(): CosmosChainWalletContext {
    return {
      ...this._getChainWalletContext(),

      getStargateClient: () =>
        this.assertWallet(
          this.wallet?.getStargateClient,
          [],
          'getStargateClient'
        ),
      getCosmWasmClient: () =>
        this.assertWallet(
          this.wallet?.getCosmWasmClient,
          [],
          'getCosmWasmClient'
        ),
      getSigningStargateClient: () =>
        this.assertWallet(
          this.wallet?.getSigningStargateClient,
          [],
          'getSigningStargateClient'
        ),
      getSigningCosmWasmClient: () =>
        this.assertWallet(
          this.wallet?.getSigningCosmWasmClient,
          [],
          'getSigningCosmWasmClient'
        ),
      getNameService: () =>
        this.assertWallet(this.wallet?.getNameService, [], 'getNameService'),

      estimateFee: (
        ...params: Parameters<CosmosChainWalletContext['estimateFee']>
      ) => this.assertWallet(this.wallet?.estimateFee, params, 'estimateFee'),
      sign: (...params: Parameters<CosmosChainWalletContext['sign']>) =>
        this.assertWallet(this.wallet?.sign, params, 'sign'),
      broadcast: (
        ...params: Parameters<CosmosChainWalletContext['broadcast']>
      ) => this.assertWallet(this.wallet?.broadcast, params, 'broadcast'),
      signAndBroadcast: (
        ...params: Parameters<CosmosChainWalletContext['signAndBroadcast']>
      ) =>
        this.assertWallet(
          this.wallet?.signAndBroadcast,
          params,
          'signAndBroadcast'
        ),

      getOfflineSigner: () =>
        this.assertWalletClient(
          this.wallet?.client?.getOfflineSigner.bind(this.wallet?.client),
          [this.chainId, this.wallet?.preferredSignType],
          'getOfflineSigner'
        ),
      getOfflineSignerAmino: () =>
        this.assertWalletClient(
          this.wallet?.client?.getOfflineSignerAmino.bind(this.wallet?.client),
          [this.chainId],
          'getOfflineSignerAmino'
        ),
      getOfflineSignerDirect: () =>
        this.assertWalletClient(
          this.wallet?.client?.getOfflineSignerDirect.bind(this.wallet?.client),
          [this.chainId],
          'getOfflineSignerDirect'
        ),
      signAmino: (
        ...params: Parameters<CosmosChainWalletContext['signAmino']>
      ) =>
        this.assertWalletClient(
          this.wallet?.client?.signAmino.bind(this.wallet?.client),
          [this.chainId, ...params],
          'signAmino'
        ),
      signDirect: (
        ...params: Parameters<CosmosChainWalletContext['signDirect']>
      ) =>
        this.assertWalletClient(
          this.wallet?.client?.signDirect.bind(this.wallet?.client),
          [this.chainId, ...params],
          'signDirect'
        ),
      sendTx: (...params: Parameters<CosmosChainWalletContext['sendTx']>) =>
        this.assertWalletClient(
          this.wallet?.client?.sendTx.bind(this.wallet?.client),
          [this.chainId, ...params],
          'sendTx'
        ),
    };
  }
}
