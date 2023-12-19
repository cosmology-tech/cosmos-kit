import { Algo } from '@cosmjs/proto-signing';
import { SignOptions, WalletAccount, WalletClient } from '@cosmos-kit/core';
import { type SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { InitiaWallet } from './type';

export class InitiaClient implements WalletClient {
  readonly client: InitiaWallet;
  private _defaultSignOptions: SignOptions = {
    preferNoSetFee: false,
    preferNoSetMemo: true,
    disableBalanceCheck: true,
  };

  get defaultSignOptions() {
    return this._defaultSignOptions;
  }

  setDefaultSignOptions(options: SignOptions) {
    this._defaultSignOptions = options;
  }

  constructor(client: InitiaWallet) {
    this.client = client;
  }

  async getSimpleAccount(chainId: string) {
    const address = await this.client.getAddress(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
    };
  }

  getOfflineSigner(chainId: string) {
    return this.client.getOfflineSigner(chainId);
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const offlineSigner = this.getOfflineSigner(chainId);
    const key = (await offlineSigner.getAccounts())[0];
    const pubkey = key.pubkey;

    console.log(Buffer.from(pubkey).toString('base64'));

    return {
      address: key.address,
      algo: key.algo as Algo,
      pubkey: key.pubkey.length === 38 ? key.pubkey.slice(5) : key.pubkey,
    };
  }

  async signDirect(chainId: string, signer: string, signDoc: SignDoc) {
    const offlineSigner = this.getOfflineSigner(chainId);

    return await offlineSigner.signDirect(signer, signDoc);
  }

  async sendTx(chainId: string, tx: Uint8Array) {
    // HACK type for testing
    return (await this.client.signAndBroadcast(
      chainId,
      tx
    )) as unknown as Uint8Array;
  }
}
