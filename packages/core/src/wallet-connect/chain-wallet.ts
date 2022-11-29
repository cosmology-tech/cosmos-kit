import EventEmitter from 'events';

import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  Wallet,
  WalletConnectClient,
} from '..';

export class ChainWalletConnect extends ChainWalletBase {
  client?: WalletConnectClient;
  emitter?: EventEmitter;

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
    this.setMessage('Connecting with WalletConnect');
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
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };
}
