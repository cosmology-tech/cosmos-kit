/* eslint-disable no-console */
import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  State,
  Wallet,
} from '@cosmos-kit/core';

import { ChainCosmostationExtensionData } from './types';
import { Cosmostation } from './types';
import { getCosmostationFromExtension } from './utils';

export class ChainCosmostationExtension extends ChainWalletBase<
  Cosmostation,
  ChainCosmostationExtensionData
> {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async fetchClient() {
    return await getCosmostationFromExtension();
  }

  async update(callbacks?: Callbacks) {
    this.setState(State.Pending);
    const offlineSigner = await this.client.getOfflineSigner(this.chainId);
    try {
      const key = await offlineSigner.getAccounts();

      this.setData({
        address: key[0].address,
        username: '',
        offlineSigner: this.chainId ? offlineSigner : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(
        `Chain ${this.chainName} keplr-extension connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
    callbacks?.connect?.();
  }
}
