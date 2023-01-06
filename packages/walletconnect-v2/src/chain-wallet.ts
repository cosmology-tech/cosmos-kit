import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import { SignClient } from '@walletconnect/sign-client';
import { SignClientTypes } from '@walletconnect/types';
import EventEmitter from 'events';

import { WCClientV2 } from './client';
import { IWCClientV2 } from './types';

export class ChainWCV2 extends ChainWalletBase {
  client!: WCClientV2;
  emitter!: EventEmitter;
  protected _qrUrl = '';
  wcSignClientOptions?: SignClientTypes.Options | undefined;
  WCClient: IWCClientV2 = WCClientV2;

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

  async fetchClient() {
    if (!this.wcSignClientOptions) {
      return void 0;
    }
    try {
      const signClient = await SignClient.init(this.wcSignClientOptions);
      return new this.WCClient(signClient);
    } catch (error) {
      this.setError(error as Error);
      return void 0;
    }
  }

  connect = async (
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> => {
    this.setMessage('Initializing QR code...');
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
      this.setMessage('QR code initialized');
      await approval();
      await this.update();
    }
  };

  disconnect = async (callbacks?: Callbacks) => {
    await (callbacks || this.callbacks)?.beforeDisconnect?.();
    this.reset();
    this.emitter.removeAllListeners();
    window.localStorage.removeItem('chain-provider');
    await this.client?.disconnect?.();
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };
}
