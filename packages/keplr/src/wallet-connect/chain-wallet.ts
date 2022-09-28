import { ChainRecord, ChainWalletBase, State } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';

import { ChainKeplrMobileData } from './types';
import { KeplrMobileWallet } from './main-wallet';


export class ChainKeplrMobile extends ChainWalletBase<
  KeplrWalletConnectV1,
  ChainKeplrMobileData,
  KeplrMobileWallet
> {

  constructor(_chainRecord: ChainRecord, keplrWallet: KeplrMobileWallet) {
    super(_chainRecord, keplrWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get connector(): WalletConnect {
    return this.client.connector as WalletConnect;
  }

  get isInSession() {
    return this.connector.connected;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get qrUri() {
    return this.connector.uri;
  }

  private get emitter() {
    return this.mainWallet.emitter;
  }

  async connect(): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this.emitter.on('update', async () => {
        await this.update();
      })
      this.emitter.on('disconnect', async () => {
        await this.disconnect();
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
        offlineSigner: this.chainId ? this.client.getOfflineSigner(this.chainId) : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(`Chain ${this.chainName} keplr-qrcode connection failed! \n ${e}`);
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }

  async disconnect() {
    // await this.connector.killSession();
    this.reset();
  }
}
