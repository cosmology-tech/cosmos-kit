/* eslint-disable no-console */
import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  State,
  Wallet,
} from '@cosmos-kit/core';

import { ChainLeapExtensionData, Leap } from './types';
import { getLeapFromExtension } from './utils';
export class ChainLeapExtension extends ChainWalletBase<
  Leap,
  ChainLeapExtensionData
> {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async fetchClient() {
    return await getLeapFromExtension();
  }

  async update(callbacks?: Callbacks) {
    this.setState(State.Pending);
    try {
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
    callbacks?.connect?.();
  }
}
