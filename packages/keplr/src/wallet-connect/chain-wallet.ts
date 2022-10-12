/* eslint-disable no-console */
import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { ChainKeplrMobileData } from './types';

export class ChainKeplrMobile extends ChainWalletBase<
  KeplrWalletConnectV1,
  ChainKeplrMobileData
> {
  private _emitter: EventEmitter;

  constructor(
    walletInfo: Wallet,
    chainInfo: ChainRecord,
    client: KeplrWalletConnectV1,
    emitter: EventEmitter
  ) {
    super(walletInfo, chainInfo);
    this._emitter = emitter;
    this._client = client;
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

  async connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this._emitter.on('update', async () => {
        await this.update();
        if (sessionOptions?.duration) {
          setTimeout(async () => {
            await this.disconnect(callbacks);
            await this.connect(sessionOptions);
          }, sessionOptions.duration);
        }
        callbacks?.connect?.();
      });
      this._emitter.on('disconnect', async () => {
        await this.disconnect(callbacks);
      });
    } else {
      await this.update();
    }
  }

  async update() {
    this.setState(State.Pending);
    try {
      const key = await this.client.getKey(this.chainId);

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
    this._emitter.removeAllListeners();
  }
}
