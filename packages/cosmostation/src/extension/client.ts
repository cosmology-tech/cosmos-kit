/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { OfflineSigner } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import { getExtensionOfflineSigner } from '@cosmostation/cosmos-client';
import { Cosmos } from '@cosmostation/extension-client';

export class CosmostationClient implements WalletClient {
  readonly client: Cosmos;

  constructor(client: Cosmos) {
    this.client = client;
  }

  async getAccount(chainId: string) {
    const key = await (this.client as Cosmos).getAccount(chainId);
    return {
      name: key.name,
      address: key.address,
      pubkey: key.publicKey,
    };
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    return await getExtensionOfflineSigner(chainId);
  }
}
