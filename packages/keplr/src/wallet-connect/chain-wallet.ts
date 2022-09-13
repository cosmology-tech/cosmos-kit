import { ChainRegistry, ChainWalletBase, Dispatch, State } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';

import { ChainWCKeplrData } from './types';
import { WCKeplrWallet } from './main-wallet';


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

  get connector() {
    return this.client.connector;
  }

  get qrUri() {
    return this.mainWallet.qrUri;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  private get emitModalOpen(): Dispatch<boolean> | undefined {
    return this.actions?.modalOpen;
  }

  async connect(): Promise<void> {
    if (!this.connector.connected) {
      await this.connector.createSession();

      this.connector.on("connect", async (error, payload) => {
        if (error) {
          throw error;
        }
        this.mainWallet.setClient(new KeplrWalletConnectV1(this.connector));
        await this.update();
        this.emitModalOpen?.(false);
      });

      this.setData({
        qrUri: this.qrUri
      })

    } else {
      await this.update();
    }
  }

  async update() {
    this.setState(State.Pending);
    try {
      const key = await this.client.getKey(this.chainName);
      this.setData({
        address: key.bech32Address,
        username: key.name,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(e);
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}
