import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import EventEmitter from 'events';

import { IWCClientV1 } from './types';

export class ChainWCV1 extends ChainWalletBase {
  client!: IWCClientV1;
  emitter!: EventEmitter;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get connector() {
    return this.client?.connector;
  }

  get qrUrl() {
    return this.connector?.uri;
  }

  get appUrl() {
    return this.client?.getAppUrl(this.env?.os);
  }

  connect = async (
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> => {
    this.setMessage('About to connect.');
    this.emitter.removeAllListeners();
    this.emitter.on('update', async () => {
      await this.update(sessionOptions, callbacks);
    });
    this.emitter.on('disconnect', async () => {
      await this.disconnect(callbacks);
    });

    if (!this.connector.connected) {
      await this.connector.createSession();
    } else {
      if (!this.isMobile) {
        await this.update(sessionOptions, callbacks);
      }
    }

    if (this.isMobile) {
      await this.update(sessionOptions, callbacks);
      if (window && this.appUrl) {
        window.location.href = this.appUrl;
      }
    }
  };

  disconnect = async (callbacks?: Callbacks) => {
    await (callbacks || this.callbacks)?.beforeDisconnect?.();
    if (this.connector.connected) {
      await this.connector.killSession();
    }
    this.reset();
    this.emitter.removeAllListeners();
    window.localStorage.removeItem('chain-provider');
    await this.client?.disconnect?.();
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };
}
