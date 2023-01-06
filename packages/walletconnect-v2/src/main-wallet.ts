/* eslint-disable no-console */
import {
  Callbacks,
  MainWalletBase,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import { SignClient } from '@walletconnect/sign-client';
import { SignClientTypes } from '@walletconnect/types';
import EventEmitter from 'events';

import { ChainWCV2 } from './chain-wallet';
import { WCClientV2 } from './client';
import { IChainWCV2, IWCClientV2 } from './types';

export class WCWalletV2 extends MainWalletBase {
  clientPromise?: Promise<WCClientV2 | undefined>;
  client?: WCClientV2;
  WCClient: IWCClientV2;
  protected _qrUrl = '';
  emitter: EventEmitter;
  wcSignClientOptions?: SignClientTypes.Options | undefined;

  constructor(walletInfo: Wallet, ChainWC: IChainWCV2, WCClient: IWCClientV2) {
    super(walletInfo, ChainWC);

    this.WCClient = WCClient;
    this.emitter = new EventEmitter();
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

  setWCSignClientOptions(
    wcSignClientOptions: SignClientTypes.Options | undefined
  ): void {
    this.wcSignClientOptions = wcSignClientOptions;
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

  protected onSetChainsDone(): void {
    this.chainWallets?.forEach((chainWallet) => {
      chainWallet.client = this.client;
      (chainWallet as ChainWCV2).WCClient = this.WCClient;
      (chainWallet as ChainWCV2).emitter = this.emitter;
      (chainWallet as ChainWCV2).wcSignClientOptions = this.wcSignClientOptions;
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

    const pairs = this.client?.signClient.core.pairing.getPairings();

    if (this.isMobile) {
      await this.update(sessionOptions, callbacks);
      if (window && this.appUrl) {
        window.location.href = this.appUrl;
      }
    }
  };

  disconnect = async (callbacks?: Callbacks) => {
    await (callbacks || this.callbacks)?.beforeDisconnect?.();
    this.chainWallets?.forEach((chain) => {
      chain.reset();
    });
    this.reset();
    this.emitter.removeAllListeners();
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };
}
