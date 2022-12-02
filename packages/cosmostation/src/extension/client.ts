import { chainRegistryChainToCosmostation } from '@chain-registry/cosmostation';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainRecord, WalletClient } from '@cosmos-kit/core';
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

  async getAccount(chainId: string) {
    const key = (await this.client.request({
      method: 'cos_requestAccount',
      params: { chainName: chainId },
    })) as RequestAccountResponse;
    return {
      name: key.name,
      address: key.address,
      pubkey: key.publicKey,
    };
  }

  on(type: string, listener: EventListenerOrEventListenerObject): void {
    const event = this.client.on(type, listener);
    const typeEventMap: Map<EventListenerOrEventListenerObject, Event> =
      this.eventMap.get(type) || new Map();
    typeEventMap.set(listener, event);
    this.eventMap.set(type, typeEventMap);
  }

  off(type: string, listener: EventListenerOrEventListenerObject): void {
    const event = this.eventMap.get(type)?.get(listener);
    if (event) {
      this.client.off(event);
    }
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    return await getExtensionOfflineSigner(chainId);
  }

  async addChain(chainInfo: ChainRecord) {
    const suggestChain = chainRegistryChainToCosmostation(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );
    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      (suggestChain.restURL as string) =
        chainInfo.preferredEndpoints?.rest?.[0];
    }
    const result = (await this.client.request({
      method: 'cos_addChain',
      params: suggestChain,
    })) as boolean;

    if (!result) {
      throw new Error(`Failed to add chain ${chainInfo.name}.`);
    }
  }
}
