import {
  ChainInfo,
  ChainName,
  SessionOptions,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { preferredEndpoints } from '../config';
import { ChainKeplrMobile } from './chain-wallet';
import { walletInfo } from './registry';
import { ChainKeplrMobileData, KeplrMobileData } from './types';

export class KeplrMobileWallet extends MainWalletBase<
  KeplrWalletConnectV1,
  KeplrMobileData,
  ChainKeplrMobileData,
  ChainKeplrMobile
> {
  protected _chains!: Map<ChainName, ChainKeplrMobile>;
  protected _client: KeplrWalletConnectV1;
  connector: WalletConnect;
  emitter: EventEmitter = new EventEmitter();

  constructor(_walletInfo: Wallet = walletInfo, _chainsInfo?: ChainInfo[]) {
    super(_walletInfo, _chainsInfo);

    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
    });

    this.connector.on('connect', (error) => {
      if (error) {
        throw error;
      }
      this.setClient(new KeplrWalletConnectV1(this.connector));
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

  get client() {
    return this._client;
  }

  setClient(client: KeplrWalletConnectV1) {
    this._client = client;
  }

  setChains(supportedChains: ChainInfo[]): void {
    this._chains = new Map(
      supportedChains.map((chainRecord) => {
        chainRecord.preferredEndpoints = {
          rpc: [
            ...(chainRecord.preferredEndpoints?.rpc || []),
            ...(preferredEndpoints[chainRecord.name]?.rpc || []),
          ],
          rest: [
            ...(chainRecord.preferredEndpoints?.rest || []),
            ...(preferredEndpoints[chainRecord.name]?.rest || []),
          ],
        };

        return [chainRecord.name, new ChainKeplrMobile(chainRecord, this)];
      })
    );
  }

  async connect(
    sessionOptions?: SessionOptions,
    callback?: () => void
  ): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this.emitter.on('update', async () => {
        await this.update();
        if (sessionOptions?.duration) {
          setTimeout(async () => {
            await this.disconnect();
            await this.connect(sessionOptions);
          }, sessionOptions?.duration);
        }
        callback?.();
      });
      this.emitter.on('disconnect', async () => {
        await this.disconnect();
      });
    } else {
      await this.update();
    }
  }

  async update() {
    this.setState(State.Done);
  }

  async disconnect(callback?: () => void) {
    if (this.connector.connected) {
      await this.connector.killSession();
    }
    this.reset();
    callback?.();
    this.emitter.removeAllListeners();
  }
}
