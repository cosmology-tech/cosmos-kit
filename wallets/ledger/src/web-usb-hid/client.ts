import { StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import Cosmos from '@ledgerhq/hw-app-cosmos';

import { ChainIdToBech32Prefix, getCosmosApp, getCosmosPath } from './utils';
export class LedgerClient implements WalletClient {
  client: Cosmos;

  constructor(client?: Cosmos) {
    this.client = client;
  }

  async initClient() {
    if (!this.client) {
      this.client = await getCosmosApp();
    }
  }

  async getSimpleAccount(chainId: string, accountIndex = 0) {
    const { address, username } = await this.getAccount(chainId, accountIndex);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async getAccount(chainId: string, accountIndex = 0, username?: string) {
    const prefix = ChainIdToBech32Prefix[chainId];
    if (!prefix) throw new Error(`Unsupported chainId: ${chainId}`);

    if (!this.client) await this.initClient();

    const path = getCosmosPath(accountIndex);
    const { address, publicKey } = await this.client.getAddress(path, prefix);
    return {
      username: username ?? path,
      address,
      algo: 'secp256k1' as Algo,
      pubkey: new TextEncoder().encode(publicKey),
      isNanoLedger: true,
    };
  }

  async sign(signDoc: StdSignDoc, accountIndex = 0) {
    if (!this.client) await this.initClient();
    return await this.client.sign(
      getCosmosPath(accountIndex),
      JSON.stringify(signDoc)
    );
  }
}
