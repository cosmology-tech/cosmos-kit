/* eslint-disable no-console */
import {
  ChainRecord,
  ChainWalletBase,
  ClientNoExistError,
  State,
} from '@cosmos-kit/core';
import { Keplr, Key } from '@keplr-wallet/types';

import { suggestChain } from '../utils';
import { KeplrExtensionWallet } from './main-wallet';
import { ChainKeplrExtensionData } from './types';
import { getKeplrFromExtension } from './utils';
export class ChainKeplrExtension extends ChainWalletBase<
  Keplr,
  ChainKeplrExtensionData,
  KeplrExtensionWallet
> {
  private _client?: Keplr;

  constructor(chainRecord: ChainRecord, mainWallet: KeplrExtensionWallet) {
    super(chainRecord, mainWallet);
  }

  get client() {
    return this._client || this._mainWallet.client;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async update() {
    this.setState(State.Pending);
    try {
      if (!this.client) {
        try {
          this._client = await getKeplrFromExtension();
        } catch (error) {
          throw ClientNoExistError;
        }
      }

      let key: Key;
      try {
        key = await this.client.getKey(this.chainId);
      } catch (error) {
        this._client = await suggestChain(this.client, this.chainInfo);
        key = await this.client.getKey(this.chainId);
      }

      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? this.client.getOfflineSigner(this.chainId)
          : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(
        `Chain ${this.chainName} keplr-extension connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
