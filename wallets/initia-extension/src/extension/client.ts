import { Algo } from '@cosmjs/proto-signing';
import {
  DirectSignDoc,
  SignOptions,
  WalletAccount,
  WalletClient,
} from '@cosmos-kit/core';

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

    return {
      address: key.address,
      algo: key.algo as Algo,
      pubkey: key.pubkey,
    };
  }

  async signDirect(chainId: string, signer: string, signDoc: DirectSignDoc) {
    const offlineSigner = this.getOfflineSigner(chainId);

    return await offlineSigner.signDirect(signer, signDoc);
  }
}
