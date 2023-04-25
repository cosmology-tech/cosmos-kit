import { WalletClient, WalletAccount } from '@cosmos-kit/core';
import { StationExtension } from './extension';
import { OfflineSigner } from './signer';
import { fromBase64 } from '@cosmjs/encoding';

export class StationClient implements WalletClient {
  readonly client: StationExtension;

  constructor(client: StationExtension) {
    this.client = client;
  }

  async disconnect() {
    this.client.disconnect();
  }

  async getSimpleAccount(chainId: string) {
    const account = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address: account.addresses[chainId],
    };
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const account = await this.client.connect();
    const infos = await this.client.info();
    const networkInfo = infos[chainId];

    if (!networkInfo) {
      return Promise.reject(
        `Unsupported chainId: ${chainId}. Please swap to ${chainId} network in Station Wallet.`
      );
    }

    const coinTypeByChainId = networkInfo.coinType;
    const accountPubkey = account.pubkey[coinTypeByChainId];

    if (!accountPubkey) {
      return Promise.reject(
        `Can't find pubkey in Station Wallet.(Coin type: ${coinTypeByChainId})`
      );
    }

    return {
      address: account.address,
      algo: 'secp256k1',
      pubkey: fromBase64(accountPubkey),
    };
  }

  async getOfflineSigner(chainId: string) {
    const accountInfo = await this.getAccount(chainId);

    return new OfflineSigner(this.client, accountInfo);
  }
}
