import { ChainName, ChainInfo, Dispatch, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { ChainWCKeplr } from './chain-wallet';
import { WCKeplrData } from './types';

export class WCKeplrWallet extends MainWalletBase<
  KeplrWalletConnectV1,
  WCKeplrData,
  ChainWCKeplr
> {
  protected _chains: Map<ChainName, ChainWCKeplr>;
  protected _client: KeplrWalletConnectV1;
  connector: WalletConnect;
  ee: EventEmitter;

  constructor(_concurrency?: number) {
    super(_concurrency);

    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org'
    });

    this.connector.on("connect", (error) => {
      if (error) {
        throw error;
      }
      this.setClient(new KeplrWalletConnectV1(this.connector));
      this.ee.emit('update');
    });

    this.connector.on("disconnect", (error) => {
      if (error) {
        throw error;
      }
      this.ee.emit('disconnect');
    });

    this._client = new KeplrWalletConnectV1(this.connector);
    this.ee = new EventEmitter();
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

  protected setChains(supportedChains: ChainInfo[]): void {
    this._chains = new Map(
      supportedChains.map((chainInfo) => [
        chainInfo.name,
        new ChainWCKeplr(chainInfo, this),
      ])
    );
  }

  async connect(): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this.ee.on('update', async () => {
        await this.update();
      })
      this.ee.on('disconnect', async () => {
        await this.disconnect();
      })
    } else {
      await this.update();
    }
  }

  async update() {
    this.setState(State.Pending);
    for (const chainName of this.chainNames) {
      const chainWallet = this.chains.get(chainName)!;
      await chainWallet.update();
      if (chainWallet.isDone) {
        this.setData({
          username: chainWallet.username,
          qrUri: this.qrUri
        });
        this.setState(State.Done);
        return;
      } else {
        this.setMessage(chainWallet.message);
        this.setState(chainWallet.state);
      }
      break
    }
  }

  async disconnect() {
    // await this.connector.killSession();
    this.reset();
  }
}