import { ChainWalletBase } from '@cosmos-kit/core';
import { ChainName, State } from '@cosmos-kit/core';

import { ChainWCKeplrData } from './types';
import { WCKeplrWallet } from './wc-keplr';

export class ChainWCKeplr extends ChainWalletBase<
  ChainWCKeplrData,
  WCKeplrWallet
> {
  protected _chainName: ChainName;
  protected keplrWallet: WCKeplrWallet;

  constructor(_chainName: ChainName, keplrWallet: WCKeplrWallet) {
    super(_chainName, keplrWallet);
    this._chainName = _chainName;
    this.keplrWallet = keplrWallet;
  }

  get client() {
    return (async () => {
      const client = await this.keplrWallet.client;
      if (!client) {
        throw new Error('No WCKeplr installed!');
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
  }
}
