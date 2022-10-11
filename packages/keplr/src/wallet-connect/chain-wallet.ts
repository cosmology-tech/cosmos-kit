/* eslint-disable no-console */
import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  State,
} from '@cosmos-kit/core';
import { Key } from '@keplr-wallet/types';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';

import { suggestChain } from '../utils';
import { KeplrMobileWallet } from './main-wallet';
import { ChainKeplrMobileData } from './types';

export class ChainKeplrMobile extends ChainWalletBase<
  KeplrWalletConnectV1,
  ChainKeplrMobileData,
  KeplrMobileWallet
> {
  protected _client: KeplrWalletConnectV1;

  constructor(_chainRecord: ChainRecord, keplrWallet: KeplrMobileWallet) {
    super(_chainRecord, keplrWallet);
  }

  get client() {
    return this._client || this.mainWallet.client;
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

  async connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this.emitter.on('update', async () => {
        await this.update();
        if (sessionOptions.duration) {
          setTimeout(() => {
            this.disconnect(callbacks);
          }, sessionOptions.duration);
        }
        callbacks?.connect?.();
      });
      this.emitter.on('disconnect', async () => {
        await this.disconnect(callbacks);
      });
    } else {
      await this.update();
    }
  }

  async update() {
    this.setState(State.Pending);
    try {
      let key: Key;
      try {
        key = await this.client.getKey(this.chainId);
      } catch (error) {
        this._client = await suggestChain(this.client, this.chainInfo);
        key = await this.client.getKey(this.chainId);
      }

      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? this.client.getOfflineSigner(this.chainId)
          : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(
        `Chain ${this.chainName} keplr-qrcode connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }

  async disconnect(callbacks?: Callbacks) {
    if (this.connector.connected) {
      await this.connector.killSession();
    }
    this.reset();
    callbacks?.disconnect?.();
    this.emitter.removeAllListeners();
  }
}
