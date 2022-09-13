import { ChainRegistry, ChainWalletBase, State } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';

import { ChainWCKeplrData } from './types';
import { WCKeplrWallet } from './keplr';
import { Keplr } from '@keplr-wallet/types';

export class ChainWCKeplr extends ChainWalletBase<
  KeplrWalletConnectV1,
  ChainWCKeplrData,
  WCKeplrWallet
> {

  constructor(_chainRegistry: ChainRegistry, keplrWallet: WCKeplrWallet) {
    super(_chainRegistry, keplrWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get qrUri() {
    return this.mainWallet.qrUri;
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
