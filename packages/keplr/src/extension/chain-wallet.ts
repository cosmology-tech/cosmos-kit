import { ChainRecord, ChainWalletBase, State } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { KeplrExtensionWallet } from './main-wallet';
import { ChainKeplrExtensionData } from './types';

export class ChainKeplrExtension extends ChainWalletBase<Keplr, ChainKeplrExtensionData, KeplrExtensionWallet> {

  constructor(_chainRecord: ChainRecord, mainWallet: KeplrExtensionWallet) {
    super(_chainRecord, mainWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async update() {
    this.setState(State.Pending);
    try {
      const keplr = await this.client;
      if (!keplr) {
        throw new Error('No Keplr Client found!')
      }
      const key = await keplr.getKey(this.chainName);
      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId ? keplr.getOfflineSigner(this.chainId) : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(`Chain ${this.chainName} keplr-extension connection failed! \n ${e}`);
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
