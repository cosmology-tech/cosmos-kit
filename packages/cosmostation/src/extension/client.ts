import { chainRegistryChainToCosmostation } from '@chain-registry/cosmostation';
import { StdSignDoc } from '@cosmjs/amino';
import { OfflineSigner } from '@cosmjs/proto-signing';
import {
  BroadcastMode,
  ChainRecord,
  DirectSignDoc,
  SignOptions,
  WalletClient,
} from '@cosmos-kit/core';
import { getExtensionOfflineSigner } from '@cosmostation/cosmos-client';

import { Cosmostation, RequestAccountResponse } from './types';

export class CosmostationClient implements WalletClient {
  readonly client: Cosmostation;
  private eventMap: Map<
    string,
    Map<EventListenerOrEventListenerObject, Event>
  > = new Map();

  constructor(client: Cosmostation) {
    this.client = client;
  }

  get cosmos() {
    return this.client.cosmos;
  }

  get keplr() {
    return this.client.providers.keplr;
  }

  async getAccount(chainId: string) {
    const key = (await this.cosmos.request({
      method: 'cos_requestAccount',
      params: { chainName: chainId },
    })) as RequestAccountResponse;
    return {
      name: key.name,
      address: key.address,
      pubkey: key.publicKey,
    };
  }

  async disconnect() {
    await this.cosmos.request({
      method: 'cos_disconnect',
    });
  }

  on(type: string, listener: EventListenerOrEventListenerObject): void {
    const event = this.cosmos.on(type, listener);
    const typeEventMap: Map<EventListenerOrEventListenerObject, Event> =
      this.eventMap.get(type) || new Map();
    typeEventMap.set(listener, event);
    this.eventMap.set(type, typeEventMap);
  }

  off(type: string, listener: EventListenerOrEventListenerObject): void {
    const event = this.eventMap.get(type)?.get(listener);
    if (event) {
      this.cosmos.off(event);
    }
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    return await getExtensionOfflineSigner(chainId);
  }

  // getOfflineSignerAmino(chainId: string) {
  //   return this.keplr.getOfflineSignerOnlyAmino(chainId);
  // }

  // getOfflineSignerDirect(chainId: string) {
  //   return this.keplr.getOfflineSigner(chainId);
  // }

  async addChain(chainInfo: ChainRecord) {
    const suggestChain = chainRegistryChainToCosmostation(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );
    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      (suggestChain.restURL as string) =
        chainInfo.preferredEndpoints?.rest?.[0];
    }
    const result = (await this.cosmos.request({
      method: 'cos_addChain',
      params: suggestChain,
    })) as boolean;

    if (!result) {
      throw new Error(`Failed to add chain ${chainInfo.name}.`);
    }
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    try {
      return await this.keplr.signAmino(chainId, signer, signDoc, signOptions);
    } catch (error) {
      return await this.cosmos.request({
        method: 'cos_signAmino',
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditMemo: signOptions?.preferNoSetMemo,
          isEditFee: signOptions?.preferNoSetFee,
        },
      });
    }
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    try {
      return await this.keplr.signDirect(chainId, signer, signDoc, signOptions);
    } catch (error) {
      return await this.cosmos.request({
        method: 'cos_signDirect',
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditMemo: signOptions?.preferNoSetMemo,
          isEditFee: signOptions?.preferNoSetFee,
        },
      });
    }
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.keplr.sendTx(chainId, tx, mode);
  }
}
