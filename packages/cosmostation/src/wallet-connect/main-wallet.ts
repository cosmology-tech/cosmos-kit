import {
  Callbacks,
  ChainRecord,
  SessionOptions,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import CosmostationWCModal from '@cosmostation/wc-modal';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { preferredEndpoints } from '../config';
import { ChainKeplrMobile } from './chain-wallet';
import { cosmostationMobileInfo } from './registry';
import { CosmostationMobileData } from './types';

export class CosmostationMobileWallet extends MainWalletBase<
  KeplrWalletConnectV1,
  CosmostationMobileData,
  ChainKeplrMobile
> {
  connector: WalletConnect;
  emitter: EventEmitter = new EventEmitter();

  constructor(
    walletInfo: Wallet = cosmostationMobileInfo,
    chains?: ChainRecord[]
  ) {
    super(walletInfo, chains);

    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: new CosmostationWCModal(),
    });

    this.connector.on('connect', (error) => {
      if (error) {
        throw error;
      }
      this._client = new KeplrWalletConnectV1(this.connector);
      this.emitter.emit('update');
    });

    this.connector.on('disconnect', (error) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('disconnect');
    });

    this._client = new KeplrWalletConnectV1(this.connector);
  }

  get isInSession() {
    return this.connector.connected;
  }

  get qrUri() {
    return this.connector.uri;
  }

  setChains(chains: ChainRecord[]): void {
    this._chainWallets = new Map(
      chains.map((chain) => {
        chain.preferredEndpoints = {
          rpc: [
            ...(chain.preferredEndpoints?.rpc || []),
            ...(preferredEndpoints[chain.name]?.rpc || []),
          ],
          rest: [
            ...(chain.preferredEndpoints?.rest || []),
            ...(preferredEndpoints[chain.name]?.rest || []),
          ],
        };

        return [
          chain.name,
          new ChainKeplrMobile(
            this.walletInfo,
            chain,
            this.client,
            this.emitter
          ),
        ];
      })
    );
  }

  async connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this.emitter.on('update', async () => {
        await this.update(callbacks);
        if (sessionOptions?.duration) {
          setTimeout(async () => {
            await this.disconnect(callbacks);
            await this.connect(sessionOptions);
          }, sessionOptions?.duration);
        }
      });
      this.emitter.on('disconnect', async () => {
        await this.disconnect(callbacks);
      });
    } else {
      await this.update(callbacks);
    }
  }

  async fetchClient() {
    return this._client;
  }

  async update(callbacks?: Callbacks) {
    this.setState(State.Done);
    callbacks?.connect?.();
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
