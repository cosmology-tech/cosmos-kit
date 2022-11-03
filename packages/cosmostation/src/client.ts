/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { OfflineSigner } from '@cosmjs/proto-signing';
import { WalletClient, WalletMode } from '@cosmos-kit/core';
import { getExtensionOfflineSigner } from '@cosmostation/cosmos-client';
import { Cosmos } from '@cosmostation/extension-client';
import { Keplr } from '@keplr-wallet/types';

export class CosmostationClient implements WalletClient {
  readonly client: Cosmos | Keplr;
  readonly mode: WalletMode;

  constructor(client: Cosmos | Keplr, mode: WalletMode) {
    this.client = client;
    this.mode = mode;
  }

  async getAccount(chainId: string) {
    let key: any;
    switch (this.mode) {
      case 'extension':
        key = await (this.client as Cosmos).getAccount(chainId);
        return {
          name: key.name,
          address: key.address,
        };
      case 'wallet-connect':
        key = await (this.client as Keplr).getKey(chainId);
        return {
          name: key.name,
          address: key.bech32Address,
        };
      default:
        throw new Error(`Mode ${this.mode} not implemented.`);
    }
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    switch (this.mode) {
      case 'extension':
        return await getExtensionOfflineSigner(chainId);
      case 'wallet-connect':
        return await this.getOfflineSigner(chainId);
      default:
        throw new Error(`Mode ${this.mode} not implemented.`);
    }
  }
}
