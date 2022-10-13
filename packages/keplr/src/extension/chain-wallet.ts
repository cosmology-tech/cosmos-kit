/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, State, Wallet } from '@cosmos-kit/core';
import { Keplr, Key } from '@keplr-wallet/types';

import { suggestChain } from '../utils';
import { ChainKeplrExtensionData } from './types';
import { getKeplrFromExtension } from './utils';
export class ChainKeplrExtension extends ChainWalletBase<
  Keplr,
  ChainKeplrExtensionData
> {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async fetchClient() {
    return await getKeplrFromExtension();
  }

  async update() {
    this.setState(State.Pending);
    try {
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
