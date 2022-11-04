/* eslint-disable no-case-declarations */
import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { ChainRecord, WalletClient, WalletMode } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

export class KeplrClient implements WalletClient {
  readonly client: Keplr;
  readonly mode: WalletMode;

  constructor(client: Keplr, mode: WalletMode) {
    this.client = client;
    this.mode = mode;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async getAccount(chainId: string) {
    const key = await this.client.getKey(chainId);
    return {
      name: key.name,
      address: key.bech32Address,
    };
  }

  getOfflineSigner(chainId: string) {
    return this.client.getOfflineSigner(chainId);
  }

  async addChain(chainInfo: ChainRecord) {
    switch (this.mode) {
      case 'extension':
        const suggestChain = chainRegistryChainToKeplr(
          chainInfo.chain,
          chainInfo.assetList ? [chainInfo.assetList] : []
        );

        if (chainInfo.preferredEndpoints?.rest?.[0]) {
          (suggestChain.rest as string) =
            chainInfo.preferredEndpoints?.rest?.[0];
        }

        if (chainInfo.preferredEndpoints?.rpc?.[0]) {
          (suggestChain.rpc as string) = chainInfo.preferredEndpoints?.rpc?.[0];
        }

        await this.client.experimentalSuggestChain(suggestChain);
        break;
      default:
        throw new Error(`Mode ${this.mode} not implemented.`);
    }
  }
}
