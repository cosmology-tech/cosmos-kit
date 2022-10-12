/* eslint-disable no-console */
import {
  ChainRecord,
  ChainWalletBase,
  ClientNoExistError,
  State,
} from '@cosmos-kit/core';

import { LeapExtensionWallet } from './main-wallet';
import { ChainLeapExtensionData, Leap } from './types';
import { getLeapFromExtension } from './utils';
export class ChainLeapExtension extends ChainWalletBase<
  Leap,
  ChainLeapExtensionData,
  LeapExtensionWallet
> {
  private _client?: Leap;

  constructor(chainRecord: ChainRecord, mainWallet: LeapExtensionWallet) {
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
          this._client = await getLeapFromExtension();
        } catch (error) {
          throw ClientNoExistError;
        }
      }

      const key = await this.client.getKey(this.chainId);

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
        `Chain ${this.chainName} leap-extension connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
