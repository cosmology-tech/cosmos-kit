/* eslint-disable no-console */
import {
  Callbacks,
  MainWalletBase,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import { SignClient } from '@walletconnect/sign-client';
import EventEmitter from 'events';

import { ChainWCV2 } from './chain-wallet';
import { WCClientV2 } from './client';
import { IChainWCV2 } from './types';

export class WCWalletV2 extends MainWalletBase {
  clientPromise?: Promise<WCClientV2 | undefined>;
  client?: WCClientV2;
  protected _qrUrl = '';
  emitter: EventEmitter;

  constructor(walletInfo: Wallet, ChainWC: IChainWCV2) {
    super(walletInfo, ChainWC);

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

  async fetchClient() {
    if (!this.walletInfo.wcProjectId) {
      throw new Error('Project ID no found!');
    }

    try {
      const signClient = await SignClient.init({
        projectId: this.walletInfo.wcProjectId,
        metadata: this.walletInfo.wcMetaData,
      });
      return new WCClientV2(signClient);
    } catch (error) {
      this.setClientNotExist();
      return void 0;
    }
  }

  protected onSetChainsDone(): void {
    this.chainWallets?.forEach((chainWallet) => {
      chainWallet.client = this.client;
      chainWallet.clientPromise = this.clientPromise;
      chainWallet.fetchClient = this.fetchClient;
      (chainWallet as ChainWCV2).emitter = this.emitter;
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

    // if () {
    //   const { uri, approval } = await signClient.connect({
    //     // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
    //     pairingTopic: pairing?.topic,
    //     // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
    //     requiredNamespaces: {
    //       eip155: {
    //         methods: [
    //           "eth_sendTransaction",
    //           "eth_signTransaction",
    //           "eth_sign",
    //           "personal_sign",
    //           "eth_signTypedData",
    //         ],
    //         chains: ["eip155:1"],
    //         events: ["chainChanged", "accountsChanged"],
    //       },
    //     },
    //   });
    // } else {
    //   if (!this.isMobile) {
    //     await this.update(sessionOptions, callbacks);
    //   }
    // }

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
