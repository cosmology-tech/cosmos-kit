/* eslint-disable no-console */
import {
  Callbacks,
  EndpointOptions,
  SessionOptions,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { CosmostationClient } from '../client';
import { ChainCosmostationMobile } from './chain-wallet';
import { getAppUrlFromQrUri } from './utils';

export class CosmostationMobileWallet extends MainWalletBase {
  client?: CosmostationClient;
  connector: WalletConnect;
  emitter: EventEmitter;

  constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions) {
    super(walletInfo, ChainCosmostationMobile);
    this.preferredEndpoints = preferredEndpoints;

    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      signingMethods: [
        'cosmostation_wc_accounts_v1',
        'cosmostation_wc_sign_tx_v1',
      ],
    });

    this.connector.on('connect', (error) => {
      if (error) {
        throw error;
      }
      this.client = new CosmostationClient(
        new KeplrWalletConnectV1(this.connector),
        this.walletInfo.mode
      );
      this.emitter.emit('update');
    });

    this.connector.on('disconnect', (error) => {
      if (error) {
        throw error;
      }
      this.emitter.emit('disconnect');
    });

    this.client = new CosmostationClient(
      new KeplrWalletConnectV1(this.connector),
      this.walletInfo.mode
    );
    this.emitter = new EventEmitter();
  }

  protected setChainsCallback(): void {
    this.chainWallets.forEach((chainWallet: ChainCosmostationMobile) => {
      chainWallet.client = this.client;
      chainWallet.connector = this.connector;
      chainWallet.emitter = this.emitter;
      chainWallet.connect = this.connect;
      chainWallet.disconnect = this.disconnect;
    });
  }

  get isInSession() {
    return this.connector.connected;
  }

  get qrUri() {
    return this.connector.uri;
  }

  get appUrl() {
    return getAppUrlFromQrUri(this.qrUri, this.env);
  }

  async connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void> {
    try {
      if (!this.connector.connected) {
        this.setState(State.Pending);
        await this.connector.createSession();

        this.emitter.on('update', async () => {
          try {
            await this.update(callbacks);
            if (sessionOptions?.duration) {
              setTimeout(async () => {
                await this.disconnect(callbacks);
                await this.connect(sessionOptions);
              }, sessionOptions?.duration);
            }
          } catch (error) {
            this.setError(error);
          }
          callbacks?.connect?.();
        });
        this.emitter.on('disconnect', async () => {
          await this.disconnect(callbacks);
        });
      } else {
        console.info('Using existing wallet connect session.');
        await this.update(callbacks);
      }
    } catch (error) {
      this.setError(error);
    }
  }

  async fetchClient() {
    return this.client;
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
