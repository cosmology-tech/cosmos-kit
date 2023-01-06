/* eslint-disable no-console */
import {
  Callbacks,
  MainWalletBase,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import EventEmitter from 'events';

import { ChainWCV1 } from './chain-wallet';
import { IChainWC, IWCClient, IWCClientV1 } from './types';

export class WCWalletV1 extends MainWalletBase {
  client: IWCClientV1;
  emitter: EventEmitter;

  constructor(walletInfo: Wallet, ChainWC: IChainWC, WCClient: IWCClient) {
    super(walletInfo, ChainWC);

    this.client = new WCClient();
    this.emitter = new EventEmitter();
    this.connector.on('connect', async (error: Error | null) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('update');
    });

    this.connector.on('session_update', async (error: Error | null) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('update');
    });

    this.connector.on('disconnect', (error: Error | null) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('disconnect');
    });
  }

  get connector() {
    return this.client?.connector;
  }

  get qrUrl() {
    return this.connector.uri;
  }

  get appUrl() {
    return this.client?.getAppUrl(this.env?.os);
  }

  fetchClient() {
    return this.client;
  }

  protected onSetChainsDone(): void {
    this.chainWallets?.forEach((chainWallet) => {
      chainWallet.client = this.client;
      chainWallet.clientPromise = this.clientPromise;
      (chainWallet as ChainWCV1).emitter = this.emitter;
      // chainWallet.connect = this.connect;
      // chainWallet.disconnect = this.disconnect;
    });
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
    this.chainWallets?.forEach((chain) => {
      chain.reset();
    });
    this.reset();
    this.emitter.removeAllListeners();
    await this.client?.disconnect?.();
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };
}
