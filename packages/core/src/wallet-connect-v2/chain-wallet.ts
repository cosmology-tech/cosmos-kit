import EventEmitter from 'events';

import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  Wallet,
} from '..';
import { WCClientV2 } from './client';

export class ChainWCV2 extends ChainWalletBase {
  client!: WCClientV2;
  emitter!: EventEmitter;
  protected _qrUrl = '';

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  get appUrl() {
    return void 0;
    // return this.client?.getAppUrl(this.env?.os);
  }

  public get qrUrl(): string {
    return this._qrUrl;
  }
  public set qrUrl(value: string) {
    this._qrUrl = value;
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

    this.client =
      this.client ||
      ((await this.clientPromise) as WCClientV2) ||
      ((await this.fetchClient()) as WCClientV2);

    if (!this.client) {
      this.setClientNotExist();
      return;
    }

    const namespaces = {
      cosmos: {
        methods: [
          'cosmos_getAccounts',
          'cosmos_signAmino',
          'cosmos_signDirect',
        ],
        chains: [`cosmos:${this.chainId}`],
        events: [],
      },
    };
    const { uri, approval } = await this.client.signClient.connect({
      requiredNamespaces: namespaces,
    });
    if (uri) {
      this.qrUrl = uri;
      const session = await approval();
      // this.client.setSession(session);
      await this.update();
    }
  };

  disconnect = async (callbacks?: Callbacks) => {
    await (callbacks || this.callbacks)?.beforeDisconnect?.();
    // if (this.connector.connected) {
    //   await this.connector.killSession();
    // }
    this.reset();
    this.emitter.removeAllListeners();
    window.localStorage.removeItem('chain-provider');
    // await this.client?.disconnect?.();
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };
}
