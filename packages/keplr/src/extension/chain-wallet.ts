import { ChainRegistry, ChainWalletBase, State } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { ExtKeplrWallet } from './main-wallet';
import { ChainExtKeplrData } from './types';

export class ChainExtKeplr extends ChainWalletBase<Keplr, ChainExtKeplrData, ExtKeplrWallet> {

  constructor(_chainRegistry: ChainRegistry, mainWallet: ExtKeplrWallet) {
    super(_chainRegistry, mainWallet);
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
      console.error(`Chain ${this.chainName} keplr-extension connection failed! \n ${e}`);
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
