import { ChainRegistry, ChainWalletBase, State } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { ExtKeplrWallet } from './main-wallet';
import { ChainKeplrData } from './types';

export class ChainKeplr extends ChainWalletBase<Keplr, ChainKeplrData, ExtKeplrWallet> {

  constructor(_chainRegistry: ChainRegistry, keplrWallet: ExtKeplrWallet) {
    super(_chainRegistry, keplrWallet);
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
      const key = await (await this.client).getKey(this.chainName);
      this.setData({
        address: key.bech32Address,
        username: key.name,
      });
      this.setState(State.Done);
    } catch (e) {
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
