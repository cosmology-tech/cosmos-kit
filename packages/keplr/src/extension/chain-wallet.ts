/* eslint-disable no-console */
import { ChainRecord, ChainWalletBase, State } from '@cosmos-kit/core';
import { Keplr, Key } from '@keplr-wallet/types';

import { suggestChain } from '../utils';
import { KeplrExtensionWallet } from './main-wallet';
import { ChainKeplrExtensionData } from './types';
export class ChainKeplrExtension extends ChainWalletBase<
  Keplr,
  ChainKeplrExtensionData,
  KeplrExtensionWallet
> {
  constructor(_chainRecord: ChainRecord, mainWallet: KeplrExtensionWallet) {
    super(_chainRecord, mainWallet);
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async update() {
    this.setState(State.Pending);
    try {
      let keplr = await this.client;

      if (!keplr) {
        throw new Error('Client Not Exist!');
      }

      let key: Key;
      try {
        key = await keplr.getKey(this.chainId);
      } catch (error) {
        keplr = await suggestChain(keplr, this.chainInfo);
        this._client = keplr;
        key = await keplr.getKey(this.chainId);
      }

      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? keplr.getOfflineSigner(this.chainId)
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
