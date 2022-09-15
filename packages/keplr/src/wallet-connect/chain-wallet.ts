import { ChainRegistry, ChainWalletBase, State } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';

import { ChainWCKeplrData } from './types';
// import { WCKeplrWallet } from './main-wallet';


export class ChainWCKeplr extends ChainWalletBase<
  KeplrWalletConnectV1,
  ChainWCKeplrData,
  any
> {

  constructor(_chainRegistry: ChainRegistry, keplrWallet: any) {
    super(_chainRegistry, keplrWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get connector() {
    return this.client.connector;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async connect(): Promise<void> {
    if (!this.connector.connected) {
      await this.connector.createSession();
      this.setData({
        qrUri: this.mainWallet.qrUri
      })
    }
    this.mainWallet.ee.on('update', async () => {
      await this.update();
    })
  }

  async update() {
    this.setState(State.Pending);
    try {
      const key = await this.client.getKey(this.chainName);
      this.setData({
        address: key.bech32Address,
        username: key.name,
        qrUri: this.mainWallet.qrUri
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(e);
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
