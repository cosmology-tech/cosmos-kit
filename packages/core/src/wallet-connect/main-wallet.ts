import EventEmitter from 'events';

import { ChainWalletConnect, IWalletConnectClient, MainWalletBase } from '..';
import {
  Callbacks,
  IChainWalletConnect,
  SessionOptions,
  Wallet,
  WalletConnectClient,
} from '..';

export class WalletConnectWallet extends MainWalletBase {
  client: WalletConnectClient;
  emitter: EventEmitter;

  constructor(
    walletInfo: Wallet,
    _ChainWalletConnect: IChainWalletConnect,
    _WalletConnectClient: IWalletConnectClient
  ) {
    super(walletInfo, _ChainWalletConnect);

    this.client = new _WalletConnectClient();
    this.emitter = new EventEmitter();
    this.connector.on('connect', async (error) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('update');
    });

    this.connector.on('session_update', async (error) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('update');
    });

    this.connector.on('disconnect', (error) => {
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
    if (!this.env?.os) {
      return void 0;
    }
    return this.client?.getAppUrl(this.env.os);
  }

  fetchClient() {
    return this.client;
  }

  protected onSetChainsDone(): void {
    this.chainWallets?.forEach((chainWallet) => {
      chainWallet.client = this.client;
      chainWallet.clientPromise = this.clientPromise;
      (chainWallet as ChainWalletConnect).emitter = this.emitter;
      chainWallet.connect = this.connect;
      chainWallet.disconnect = this.disconnect;
    });
  }

  async connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> {
    this.emitter.removeAllListeners();
    this.emitter.on('update', async () => {
      await this.update(sessionOptions, callbacks);
    });
    this.emitter.on('disconnect', async () => {
      await this.disconnect(callbacks);
    });

    if (!this.connector.connected) {
      this.connector.createSession();
    } else {
      this.update(sessionOptions, callbacks);
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
