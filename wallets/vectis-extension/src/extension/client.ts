/* eslint-disable @typescript-eslint/no-unused-vars */
import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { Algo, StdSignature, StdSignDoc } from '@cosmjs/amino';
import {
  BroadcastMode,
  ChainRecord,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  SignOptions,
  SignType,
  WalletClient,
} from '@cosmos-kit/core';

import type { Vectis } from './types';

export class VectisClient implements WalletClient {
  readonly client: Vectis;

  constructor(client: Vectis) {
    this.client = client;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async getSimpleAccount(chainId: string) {
    const { address, name } = await this.client.getKey(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username: name,
    };
  }

  async getAccount(chainId: string) {
    const { address, algo, pubkey, name, isNanoLedger, isVectisAccount } =
      await this.client.getKey(chainId);
    return {
      username: name,
      address,
      algo: algo as Algo,
      pubkey,
      isNanoLedger,
      isSmartContract: isVectisAccount,
    };
  }

  async getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
  }

  getOfflineSignerAmino(chainId: string) {
    return this.client.getOfflineSignerAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return this.client.getOfflineSignerDirect(chainId);
  }

  async addChain({ chain, name, assetList, preferredEndpoints }: ChainRecord) {
    const chainInfo = chainRegistryChainToKeplr(
      chain,
      assetList ? [assetList] : []
    );

    if (preferredEndpoints?.rest?.[0]) {
      (chainInfo.rest as string | ExtendedHttpEndpoint) =
        preferredEndpoints?.rest?.[0];
    }

    if (preferredEndpoints?.rpc?.[0]) {
      (chainInfo.rpc as string | ExtendedHttpEndpoint) =
        preferredEndpoints?.rpc?.[0];
    }

    await this.client.suggestChains([chainInfo]);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signAmino(signer, signDoc);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signDirect(signer, signDoc);
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    return await this.client.signArbitrary(chainId, signer, data);
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
}
