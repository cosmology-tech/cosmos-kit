import {
  ChainRecord,
  ChainWalletBase,
  ClientNoExistError,
  State,
} from '@cosmos-kit/core';

import { LeapExtensionWallet } from './main-wallet';
import { ChainLeapExtensionData, Leap } from './types';
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
      const leap = await this.client;
      if (!leap) {
        throw ClientNoExistError;
      }

      const key = await leap.getKey(this.chainId);

      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? leap.getOfflineSigner(this.chainId)
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
