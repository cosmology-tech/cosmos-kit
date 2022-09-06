import { ChainName, ChainWalletBase, State } from '@cosmos-kit/core';

import { KeplrWallet } from './keplr';
import { ChainKeplrData } from './types';

export class ChainKeplr extends ChainWalletBase<ChainKeplrData, KeplrWallet> {
  protected _chainName: ChainName;
  protected keplrWallet: KeplrWallet;

  constructor(_chainName: ChainName, keplrWallet: KeplrWallet) {
    super(_chainName, keplrWallet);
    this._chainName = _chainName;
    this.keplrWallet = keplrWallet;
  }

  get client() {
    return (async () => {
      const client = await this.keplrWallet.client;
      if (!client) {
        throw new Error('No Keplr installed!');
      }
      return client;
    })();
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async update() {
    this.setState(State.Pending);
    try {
      const key = await (await this.client).getKey(this.chainName);
      this.setData({
        address: key.bech32Address,
        username: key.name,
      });
      this.setState(State.Done);
    } catch (e) {
      this.setState(State.Error);
      console.info(`Fail to update chain ${this.chainName}.`);
      throw e;
    }
    this.actions?.openModal?.(false);
  }
}
